#!/usr/bin/env python3
"""Thin, auditable wrapper around the official Wan2.2 generate.py CLI.

This file intentionally does not vendor Wan model code or weights. It validates inputs,
constructs the supported TI2V/I2V command, and delegates temporal generation to the
upstream Wan2.2 implementation.
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path
import subprocess
import sys


def positive_4n_plus_1(value: str) -> int:
    n = int(value)
    if n <= 0 or (n - 1) % 4 != 0:
        raise argparse.ArgumentTypeError("frame count must be positive and satisfy 4n+1")
    return n


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Generate a real video clip with Wan2.2")
    p.add_argument("--wan-dir", type=Path, default=Path(os.getenv("WAN22_DIR", "external/Wan2.2")))
    p.add_argument("--model-dir", type=Path, default=Path(os.getenv("WAN22_MODEL_DIR", "models/Wan2.2-TI2V-5B")))
    p.add_argument("--image", type=Path, required=True)
    p.add_argument("--prompt", required=True)
    p.add_argument("--output", type=Path, required=True)
    p.add_argument("--task", default="ti2v-5B", choices=["ti2v-5B", "i2v-A14B"])
    p.add_argument("--size", default="1280*704")
    p.add_argument("--frames", type=positive_4n_plus_1, default=121)
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--no-offload", action="store_true")
    return p


def validate(args: argparse.Namespace) -> None:
    generate_py = args.wan_dir / "generate.py"
    if not generate_py.exists():
        raise SystemExit(f"Wan2.2 generate.py not found: {generate_py}")
    if not args.model_dir.exists():
        raise SystemExit(f"Wan2.2 model directory not found: {args.model_dir}")
    if not args.image.exists():
        raise SystemExit(f"Input image not found: {args.image}")
    args.output.parent.mkdir(parents=True, exist_ok=True)


def make_command(args: argparse.Namespace) -> list[str]:
    cmd = [
        sys.executable,
        str(args.wan_dir / "generate.py"),
        "--task", args.task,
        "--size", args.size,
        "--ckpt_dir", str(args.model_dir),
        "--image", str(args.image),
        "--prompt", args.prompt,
        "--frame_num", str(args.frames),
        "--base_seed", str(args.seed),
        "--save_file", str(args.output),
    ]

    # The 5B profile is designed to be practical on a 24 GB class GPU using these flags.
    # The 14B model is intentionally allowed but users should expect much larger VRAM needs.
    if not args.no_offload:
        cmd += ["--offload_model", "True", "--convert_model_dtype"]
        if args.task == "ti2v-5B":
            cmd += ["--t5_cpu"]
    return cmd


def main() -> int:
    args = build_parser().parse_args()
    validate(args)
    cmd = make_command(args)

    print("[LighAura Video Engine] Launching Wan2.2 temporal generation")
    print(" ".join(subprocess.list2cmdline([part]) for part in cmd))
    completed = subprocess.run(cmd, cwd=args.wan_dir)
    if completed.returncode != 0:
        return completed.returncode
    if not args.output.exists():
        raise SystemExit(f"Wan2.2 completed but output video was not created: {args.output}")
    print(f"[LighAura Video Engine] Created: {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
