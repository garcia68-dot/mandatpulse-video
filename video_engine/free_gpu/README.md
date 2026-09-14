# Zero-cost GPU mode

Primary goal: generate LighAura videos without paying for GPU compute.

## Default free backend: Kaggle Notebooks

Kaggle currently provides free GPU notebook sessions. The preferred accelerator is **T4 x2** (2 x 16 GB VRAM), with 12-hour notebook sessions and a weekly GPU quota. This is enough to prototype real image-to-video generation when combined with LightX2V's low-resource / quantized inference path.

This mode intentionally does **not** use the paid/self-hosted `wan-gpu` workflow.

## Why LightX2V

LightX2V supports Wan-family image-to-video models with:

- aggressive CPU/disk/GPU offloading
- INT8 / FP8 quantization
- distilled 4-step checkpoints
- low-resource deployment documented down to 8 GB VRAM + 16 GB system RAM

That makes it much better suited to free T4-class GPUs than the stock Wan2.2 TI2V-5B path, which expects ~24 GB VRAM on a single GPU.

## Zero-cost development plan

1. Run the first real LighAura I2V clips on Kaggle free T4 GPUs.
2. Start with the low-resource distilled pipeline for reliability.
3. Chain generated shots using `video_engine/orchestrate.py` semantics: last frame of one shot becomes the next shot reference.
4. Export the resulting MP4 and scroll-frame sequence.
5. Only after the pipeline works, add optional fine-tuning / LoRA experiments using free notebook quota.

## Quick start

Create a Kaggle notebook, enable **Accelerator → GPU (T4 x2)**, enable Internet, then run:

```bash
git clone -b video-engine-wan22 https://github.com/garcia68-dot/mandatpulse-video.git /kaggle/working/mandatpulse-video
cd /kaggle/working/mandatpulse-video
bash video_engine/free_gpu/bootstrap_kaggle.sh
```

The bootstrap script installs LightX2V and its dependencies into the Kaggle session and prints the next generation command.

## Cost policy

The default project path must remain usable without a paid GPU account. Paid GPU backends are optional acceleration paths only; they are not required for personal use.