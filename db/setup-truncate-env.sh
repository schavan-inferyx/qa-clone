#!/bin/bash
set -e

sudo apt update -y
sudo apt install -y expect openssh-client mysql-client-core-8.0

echo "✅ Dependencies installed"
