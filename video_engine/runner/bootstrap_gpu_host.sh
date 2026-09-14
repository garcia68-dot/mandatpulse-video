#!/usr/bin/env bash
set -euo pipefail

ROOT="${LIGHTAURA_ROOT:-/opt/lighaura}"
WAN_DIR="$ROOT/Wan2.2"
MODEL_DIR="$ROOT/models/Wan2.2-TI2V-5B"
VENV_DIR="$ROOT/venv"
HF_HOME="$ROOT/hf-cache"

if ! command -v nvidia-smi >/dev/null 2>&1; then
  echo "ERROR: NVIDIA driver / nvidia-smi is not available. Use a CUDA GPU host." >&2
  exit 1
fi

nvidia-smi

if command -v apt-get >/dev/null 2>&1; then
  sudo apt-get update
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
    git curl jq ffmpeg python3 python3-venv python3-pip ca-certificates file
fi

sudo mkdir -p "$ROOT/models" "$HF_HOME"
sudo chown -R "$(id -u):$(id -g)" "$ROOT"

if [ ! -d "$WAN_DIR/.git" ]; then
  git clone --depth 1 https://github.com/Wan-Video/Wan2.2.git "$WAN_DIR"
else
  git -C "$WAN_DIR" fetch --depth 1 origin main
  git -C "$WAN_DIR" reset --hard origin/main
fi

python3 -m venv "$VENV_DIR"
"$VENV_DIR/bin/python" -m pip install --upgrade pip wheel setuptools

# Prefer a CUDA-enabled PyTorch wheel. If a provider image already ships a working
# CUDA PyTorch stack, this remains compatible with the same venv after installation.
"$VENV_DIR/bin/pip" install --index-url https://download.pytorch.org/whl/cu124 \
  "torch>=2.4" torchvision

"$VENV_DIR/bin/pip" install -r "$WAN_DIR/requirements.txt"
"$VENV_DIR/bin/pip" install "huggingface_hub[cli]"

export HF_HOME
if [ ! -f "$MODEL_DIR/models_t5_umt5-xxl-enc-bf16.pth" ]; then
  mkdir -p "$MODEL_DIR"
  "$VENV_DIR/bin/hf" download Wan-AI/Wan2.2-TI2V-5B \
    --local-dir "$MODEL_DIR"
else
  echo "Wan2.2 TI2V-5B model cache already present: $MODEL_DIR"
fi

"$VENV_DIR/bin/python" - <<'PY'
import torch
print("torch:", torch.__version__)
print("cuda available:", torch.cuda.is_available())
if not torch.cuda.is_available():
    raise SystemExit("CUDA is not available to PyTorch")
p = torch.cuda.get_device_properties(0)
print("gpu:", p.name)
print("vram_gib:", round(p.total_memory / 1024**3, 2))
if p.total_memory < 23 * 1024**3:
    raise SystemExit("Default LighAura Wan2.2 profile expects roughly 24 GiB VRAM")
PY

echo
echo "GPU host is ready."
echo "Wan checkout:  $WAN_DIR"
echo "Model weights: $MODEL_DIR"
echo "Python venv:   $VENV_DIR"
echo "Next: install/register the GitHub self-hosted runner with label 'wan-gpu'."
