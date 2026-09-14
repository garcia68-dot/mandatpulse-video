#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-garcia68-dot/mandatpulse-video}"
RUNNER_TOKEN="${GITHUB_RUNNER_TOKEN:-}"
RUNNER_DIR="${RUNNER_DIR:-/opt/actions-runner}"
RUNNER_NAME="${RUNNER_NAME:-lighaura-wan-gpu}"
RUNNER_LABELS="${RUNNER_LABELS:-wan-gpu}"

if [ -z "$RUNNER_TOKEN" ]; then
  echo "ERROR: set GITHUB_RUNNER_TOKEN to a current self-hosted runner registration token." >&2
  echo "GitHub: Settings > Actions > Runners > New self-hosted runner" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  sudo apt-get update && sudo apt-get install -y jq curl ca-certificates
fi

ARCH="x64"
case "$(uname -m)" in
  x86_64) ARCH="x64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

VERSION="$(curl -fsSL https://api.github.com/repos/actions/runner/releases/latest | jq -r '.tag_name' | sed 's/^v//')"
TARBALL="actions-runner-linux-${ARCH}-${VERSION}.tar.gz"
URL="https://github.com/actions/runner/releases/download/v${VERSION}/${TARBALL}"

sudo mkdir -p "$RUNNER_DIR"
sudo chown -R "$(id -u):$(id -g)" "$RUNNER_DIR"
cd "$RUNNER_DIR"

if [ ! -x ./config.sh ]; then
  curl -fL "$URL" -o "$TARBALL"
  tar xzf "$TARBALL"
  rm -f "$TARBALL"
fi

./config.sh \
  --url "https://github.com/$REPO" \
  --token "$RUNNER_TOKEN" \
  --name "$RUNNER_NAME" \
  --labels "$RUNNER_LABELS" \
  --work "_work" \
  --unattended \
  --replace

sudo ./svc.sh install "$(id -un)"
sudo ./svc.sh start
sudo ./svc.sh status

echo
echo "Runner registered for $REPO with label: $RUNNER_LABELS"
echo "The workflow '.github/workflows/video-engine-gpu.yml' can now claim this machine."
