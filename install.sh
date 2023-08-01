#!/bin/bash

secure_jenkins=false
custom_electron=false

debug_=false
cleanup_=false

function debug_log () {
	if [ $debug_ == "true" ]; then
		echo "$1"
	fi

}

while getopts ":vscC" opt; do
	  case ${opt} in
	  	v )
			debug_=true
			;;
        s )
			secure_jenkins=true
        ;;
		c )
			custom_electron=true
		;;
		C )
			cleanup_=true
		;;
        \? ) 
		echo "Usage: install 
-s: secure jenkins var
-c: custom electron
-C: cleanup
-v: verbose
"
			exit
        ;;
    esac
done

function configure() {
	debug_log "==================== configure ===================="
	export npm_config_package_lock=false

	if [ $secure_jenkins == true ]; then
		debug_log "secure jenkins"
		export SECURE_JENKINS="TRUE"
	fi
	
	if [ $custom_electron == true ]; then
		debug_log "custom electron"
		export npm_config_registry="http://nexus.int.rclabenv.com/nexus/content/groups/npm-all/"
	fi
}

function build() {
	debug_log "==================== build ===================="
	npm i --verbose
}

function clean() {
	if [ $cleanup_ != true ]; then
		return 0
	fi

	debug_log "==================== clean ===================="

	rm -rf ./package-lock.json
	rm -rf ./node_modules
}

function main() {
	debug_log "==================== main ===================="
	clean
	configure
	build
}

main

