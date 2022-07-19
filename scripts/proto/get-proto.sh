#!/bin/bash
# TODO: generate new proto automatically with support of context from Tgrade repo
# Steps:
# - Create a tgrade/ folder on the same folder as the codegen.sh and get-proto.sh.
# - Then inside that new tgrade/ folder you need 2 subfolders: confio/ and third_party/.
# **************************************
## 1. src/scripts/proto/get-proto.sh
## 2. src/scripts/proto/codegen.sh
## 3. src/scripts/proto/tgrade/confio/
## 4. src/scripts/proto/tgrade/third_party/
# **************************************

# - Then for 3 and 4 we now need to fill those folders with content:
# - The contents for tgrade/confio/ come from https://github.com/confio/tgrade/tree/main/proto/confio
# - The contents for tgrade/third_party/ come from https://github.com/confio/tgrade/tree/main/third_party

# To clone content - clone the main branch from the Tgrade repo and copy pasting those folders there.
# After you should be able to execute the codegen.sh script by yarn proto command.
