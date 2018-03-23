
# My Fancy Node.js project
#

PROJECT = "Caesar"


all: install build move 
# alias 


install: ;@echo "Installing ${PROJECT}....."; \
	npm install 

build: ;@echo "Building ${PROJECT}....."; \
    pkg caesar.js --targets node8-linux-x64 

move:  ;@echo "Moving ${PROJECT}....."; \
    mv ./caesar-linux ./caesar

# alias: ;@echo "Generating alias for ${PROJECT}....."; \
#     sudo install ./caesar /usr/bin/caesar

.PHONY: install build move
#  alias 




