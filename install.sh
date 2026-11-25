#!/bin/sh
# Install the latest Hangar on macOS or Linux (x86-64):
#   curl -fsSL https://caoquyen1913.github.io/hangar-app/install.sh | sh
# macOS: curl does not tag downloads with com.apple.quarantine, so Gatekeeper does not stop the
# (ad-hoc signed, not notarized) app the way it does for a dmg downloaded in a browser.
# Linux: installs the AppImage, which the in-app updater can replace later.
set -eu

REPO=Caoquyen1913/hangar-app

# /releases/latest redirects to /releases/tag/vX.Y.Z (no API call, no rate limit).
tag=$(curl -fsSLI -o /dev/null -w '%{url_effective}' "https://github.com/$REPO/releases/latest")
tag=${tag##*/}
version=${tag#v}

tmp=$(mktemp -d)
mnt="$tmp/mnt"
trap 'hdiutil detach "$mnt" -quiet 2>/dev/null || true; rm -rf "$tmp"' EXIT

fetch() {
  echo "Downloading Hangar $tag ($1)..."
  curl -fL --progress-bar -o "$tmp/$1" "https://github.com/$REPO/releases/download/$tag/$1"
}

case "$(uname -s)" in
Darwin)
  arch=x64
  # A shell under Rosetta reports x86_64 on Apple silicon; ask the kernel instead.
  if [ "$(uname -m)" = arm64 ] || [ "$(sysctl -n sysctl.proc_translated 2>/dev/null)" = 1 ]; then
    arch=aarch64
  fi
  dmg="Hangar_${version}_${arch}.dmg"
  fetch "$dmg"

  dest=/Applications
  [ -w "$dest" ] || { dest="$HOME/Applications"; mkdir -p "$dest"; }
  app="$dest/Hangar.app"

  mkdir "$mnt"
  hdiutil attach -nobrowse -readonly -noautoopen -mountpoint "$mnt" "$tmp/$dmg" >/dev/null
  pkill -f "$app/Contents/MacOS/" 2>/dev/null && sleep 1 || true
  rm -rf "$app.new"
  ditto "$mnt/Hangar.app" "$app.new"
  rm -rf "$app"
  mv "$app.new" "$app"

  echo "Installed $app"
  open "$app"
  ;;
Linux)
  [ "$(uname -m)" = x86_64 ] || { echo "Hangar for Linux is built for x86-64 only." >&2; exit 1; }
  file="hangar-app_${version}_x86_64.AppImage"
  fetch "$file"

  bin="$HOME/.local/bin"
  target="$bin/Hangar.AppImage"
  mkdir -p "$bin"
  chmod +x "$tmp/$file"
  mv -f "$tmp/$file" "$target"

  # Menu entry so Hangar shows up next to the other apps.
  apps="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
  mkdir -p "$apps"
  cat > "$apps/hangar.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=Hangar
Exec="$target"
Terminal=false
Categories=Development;
EOF

  echo "Installed $target (find Hangar in your app menu)"
  echo "If it does not start, install FUSE 2 (Ubuntu 24.04+: sudo apt install libfuse2t64; older Debian/Ubuntu: libfuse2)."
  ;;
*)
  echo "This installer is for macOS and Linux. Windows: https://caoquyen1913.github.io/hangar-app/#download" >&2
  exit 1
  ;;
esac
