#!/usr/bin/env bash
set -euo pipefail

ROOT="${ROOT:-/kaggle/working}"
LIGHTX2V_DIR="$ROOT/LightX2V"
MODEL_DIR="$ROOT/models/Wan2.1-I2V-14B-480P"

python - <<'PY'
import os, torch
print('Kaggle:', os.path.exists('/kaggle'))
print('CUDA available:', torch.cuda.is_available())
if torch.cuda.is_available():
    for i in range(torch.cuda.device_count()):
        p = torch.cuda.get_device_properties(i)
        print(i, p.name, round(p.total_memory / 1024**3, 1), 'GiB')
PY

if [ ! -d "$LIGHTX2V_DIR/.git" ]; then
  git clone --depth 1 https://github.com/ModelTC/LightX2V.git "$LIGHTX2V_DIR"
else
  git -C "$LIGHTX2V_DIR" pull --ff-only
fi

python -m pip install -q --upgrade pip setuptools wheel
python -m pip install -q -e "$LIGHTX2V_DIR"
python -m pip install -q 'huggingface_hub[cli]'

# Keep large model files in Kaggle scratch/working storage only for the active free session.
mkdir -p "$MODEL_DIR"

# Download the official 480p I2V model. LightX2V's low-resource path can offload
# model blocks between disk, CPU and GPU, allowing T4-class GPUs to run large models.
huggingface-cli download Wan-AI/Wan2.1-I2V-14B-480P \
  --local-dir "$MODEL_DIR"

mkdir -p /kaggle/working/lighaura_input /kaggle/working/lighaura_output

echo
echo 'Bootstrap complete.'
echo 'Next: place the LighAura starting image at:'
echo '  /kaggle/working/lighaura_input/start.png'
echo 'Then run:'
echo '  bash /kaggle/working/mandatpulse-video/video_engine/free_gpu/generate_lighaura_kaggle.sh'