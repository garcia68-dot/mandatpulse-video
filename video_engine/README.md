# LighAura Video Engine

This directory turns the repository from a Remotion-only renderer into a real video-generation orchestrator.

## Architecture

1. **Keyframe / art direction** — a reference image (for example a GPT Image product shot).
2. **Temporal generation** — Wan2.2 TI2V-5B generates new frames over time from the reference image and a motion prompt.
3. **Shot chaining** — the last frame of one generated clip becomes the starting image of the next clip, reducing visual drift.
4. **Master assembly** — FFmpeg concatenates the generated clips into one MP4.
5. **Scroll assets** — FFmpeg exports a numbered WebP/JPEG frame sequence for a browser canvas scrubber.
6. **Remotion** — reserved for typography, compositing, sound and final editorial polish. Remotion is no longer asked to invent object motion.

## Why Wan2.2 TI2V-5B first

The official Wan2.2 project supports text+image-to-video at 720p / 24 fps. The TI2V-5B path is documented to run on a 24 GB GPU with model offload, dtype conversion and T5 on CPU. That makes it a much more realistic first local/open-source engine than the 14B I2V path, which is substantially heavier.

## Requirements

- Linux recommended
- NVIDIA GPU with ~24 GB VRAM for the default TI2V-5B profile
- CUDA-compatible PyTorch stack required by Wan2.2
- FFmpeg
- A local checkout of the official `Wan-Video/Wan2.2` repository
- Model weights for `Wan-AI/Wan2.2-TI2V-5B`

The model weights are **not** committed here.

## Install the inference backend manually

```bash
git clone https://github.com/Wan-Video/Wan2.2.git external/Wan2.2
cd external/Wan2.2
pip install -r requirements.txt
pip install "huggingface_hub[cli]"
huggingface-cli download Wan-AI/Wan2.2-TI2V-5B --local-dir ../../models/Wan2.2-TI2V-5B
cd ../..
```

## Generate one real image-to-video clip

```bash
python video_engine/wan22_clip.py \
  --wan-dir external/Wan2.2 \
  --model-dir models/Wan2.2-TI2V-5B \
  --image input/start.png \
  --prompt "A luxury gaming headset assembles mechanically in mid-air. Rigid parts converge smoothly along precise paths. The camera performs a very slow cinematic dolly-in. Preserve the product design, black metal, champagne-gold trim and scarlet light strips. No morphing, no text changes." \
  --output output/assembly.mp4
```

## Generate the LighAura hero sequence

Edit `presets/lighaura_hero.json` so `initial_image` points to the chosen clean hero keyframe, then run:

```bash
python video_engine/orchestrate.py \
  --preset video_engine/presets/lighaura_hero.json \
  --wan-dir external/Wan2.2 \
  --model-dir models/Wan2.2-TI2V-5B \
  --output-dir output/lighaura
```

This creates separate generated clips, extracts the last frame of each clip for continuity, concatenates them, then exports scroll frames.

## GitHub -> GPU runner -> Wan2.2

The branch now includes a real GPU workflow at `.github/workflows/video-engine-gpu.yml`.
It deliberately targets a self-hosted runner with the `wan-gpu` label rather than a normal GitHub-hosted runner.

### 1. Prepare a rented NVIDIA machine

On an Ubuntu GPU host with about 24 GB VRAM or more, clone this branch and run:

```bash
bash video_engine/runner/bootstrap_gpu_host.sh
```

The bootstrap installs/validates FFmpeg, CUDA-enabled PyTorch, Wan2.2 and the public `Wan-AI/Wan2.2-TI2V-5B` weights under `/opt/lighaura`.

### 2. Register the machine as a GitHub runner

In GitHub open:

`Settings -> Actions -> Runners -> New self-hosted runner`

Copy the short-lived registration token, then on the GPU machine run:

```bash
export GITHUB_RUNNER_TOKEN='...'
bash video_engine/runner/install_github_runner.sh
```

The runner registers with the custom label `wan-gpu` and installs itself as a system service.

### 3. Launch a real generation

From GitHub Actions choose **Generate LighAura hero on GPU**, paste a direct URL for the clean starting keyframe, and run the workflow.

The job performs:

- GPU/VRAM preflight
- reference-image download
- three real Wan2.2 temporal generations (`assembly`, `reveal`, `dolly_out_to_shop`)
- last-frame chaining between shots
- FFmpeg concatenation
- WebP scroll-frame export
- GitHub artifact upload
- optional delayed host shutdown after upload

The resulting GitHub artifact contains the master MP4, individual clips, continuity reference frames, manifest, and browser scroll frames.

## Fine-tuning strategy

Do **not** train a foundation video model from zero. Start from Wan2.2 and fine-tune LoRAs for narrow capabilities such as:

- premium product cinematography
- exploded mechanical assembly
- stable product identity under camera motion
- controlled dolly / orbit / crane movements
- transition from hero shot into ecommerce layout

DiffSynth-Studio already provides Wan2.2 LoRA / full-training infrastructure, so the training phase should reuse that stack rather than reinventing distributed training.

## Current limitation

The orchestration and GitHub-to-GPU path are implemented. The remaining external dependency is an actual CUDA GPU host registered as the `wan-gpu` self-hosted runner. Standard GitHub-hosted Actions runners cannot execute the Wan inference step.