#!/usr/bin/env bash
set -euo pipefail

ROOT="${ROOT:-/kaggle/working}"
LIGHTX2V_DIR="$ROOT/LightX2V"
MODEL_DIR="$ROOT/models/Wan2.1-I2V-14B-480P"
IMAGE="${LIGHTAURA_IMAGE:-$ROOT/lighaura_input/start.png}"
OUT_DIR="${LIGHTAURA_OUT:-$ROOT/lighaura_output}"
OUT="$OUT_DIR/lighaura-assembly-real.mp4"

PROMPT="${LIGHTAURA_PROMPT:-Cinematic luxury product film. Preserve the exact gaming headset identity and materials from the input image. The headset starts in an exploded mechanical state and assembles physically in mid-air. Rigid earcup shells, cushions, drivers, hinges, headband and microphone follow precise smooth trajectories and lock together. No melting, no morphing, no duplicated pieces. Slow controlled cinematic camera movement, premium supercar and luxury watch advertising aesthetic, realistic metallic reflections, white silver architecture, champagne gold highlights, scarlet lighting, coherent perspective and physically plausible motion.}"

[ -f "$IMAGE" ] || { echo "Missing input image: $IMAGE"; exit 2; }
[ -d "$LIGHTX2V_DIR/lightx2v" ] || { echo "Run bootstrap_kaggle.sh first"; exit 2; }
[ -d "$MODEL_DIR" ] || { echo "Run bootstrap_kaggle.sh first"; exit 2; }
mkdir -p "$OUT_DIR"

export CUDA_VISIBLE_DEVICES=0
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
export DTYPE=FP16
export SENSITIVE_LAYER_DTYPE=FP16

source "$LIGHTX2V_DIR/scripts/base/base.sh"

cd "$LIGHTX2V_DIR"
python -m lightx2v.infer \
  --model_cls wan2.1 \
  --task i2v \
  --model_path "$MODEL_DIR" \
  --config_json "$LIGHTX2V_DIR/configs/offload/disk/wan_i2v_phase_lazy_load_480p.json" \
  --prompt "$PROMPT" \
  --image_path "$IMAGE" \
  --num_frames 81 \
  --size 480 832 \
  --seed 68021 \
  --save_result_path "$OUT"

echo "Generated: $OUT"
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height,r_frame_rate -of json "$OUT" || true