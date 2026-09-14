# Specializing the engine instead of training from zero

The target is not a general-purpose foundation model. The first useful specialization is **premium product motion**.

## Phase 1 — Baseline before training

Generate 20–50 clips with stock Wan2.2 TI2V-5B and score them on:

- product identity stability
- geometry stability
- rigid mechanical motion
- camera-motion adherence
- lighting continuity
- absence of morphing / duplicate parts
- suitability for frame-by-frame web scrolling

Do not fine-tune until the failure modes are measured.

## Phase 2 — Curate a small, high-quality dataset

Recommended first dataset: 100–300 short clips, each 2–6 seconds, with captions that explicitly describe:

- object identity and materials
- start state and end state
- rigid-part trajectories
- camera motion
- lighting motion
- negative constraints (no morphing, no duplicate parts)

The clips should be visually coherent, rights-cleared, and focused on product cinematography rather than broad internet video.

Suggested dataset categories:

1. exploded mechanical assembly
2. product orbit / turntable reveal
3. dolly-in and dolly-out
4. crane-up / crane-down
5. lighting activation and energy reveal
6. ecommerce hero-to-product-grid transitions

## Phase 3 — LoRA, not full training

Use DiffSynth-Studio's Wan2.2 training stack to train narrow LoRAs. Keep separate adapters at first:

- `lighaura-product-cinema`
- `lighaura-rigid-assembly`
- `lighaura-camera-control`

This makes regression testing and adapter weighting much easier than one monolithic fine-tune.

## Phase 4 — Evaluation harness

For every candidate adapter, render the same fixed validation prompts and reference images. Keep a JSON scorecard per run. Do not promote a LoRA only because one showcase clip looks good.

## Phase 5 — Production routing

The orchestrator should eventually select an adapter by shot type:

- assembly shot -> rigid-assembly LoRA
- product reveal -> product-cinema LoRA
- transition shot -> camera-control LoRA

Remotion remains downstream for editorial compositing and export.

## Infrastructure note

Training and inference require CUDA GPU compute. GitHub stores and versions the code/configuration, but the neural network is trained on a GPU runner. Standard GitHub-hosted CPU runners are only used for validation tests.