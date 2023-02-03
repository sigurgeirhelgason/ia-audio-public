#!/bin/bash

FAILURE="false"

function echo_failure {
    echo -e "\033[1;31m$1\033[0m"
}

function echo_success {
    echo -e "\033[1;32m$1\033[0m"
}

function echo_uptodate {
    echo -e "\033[1;36m$1\033[0m"
}

function verify {
    tool="$1"
    expected_version="$2"
    get_version_version_command="$3"

    tool_exists="$(which "${tool}")"
    exit_code="$?"
    if [ "${exit_code}" != "0" ]; then
        echo_failure "Error: ${tool} not found in PATH"
        FAILURE="true"
        return
    fi
    
    actual_version="$(eval ${get_version_version_command} 2> /dev/null)"
    exit_code="$?"
    if [ "${exit_code}" != "0" ]; then
        echo_failure "Error: could not parse ${tool} version"
        FAILURE="true"
        return
    fi

    expected_major_version="$(echo ${expected_version} | cut -d '.' -f1)"
    actual_major_version="$(echo ${actual_version} | cut -d '.' -f1)"

    expected_minor_version="$(echo ${expected_version} | cut -d '.' -f2)"
    actual_minor_version="$(echo ${actual_version} | cut -d '.' -f2)"

    expected_patch_version="$(echo ${expected_version} | cut -d '.' -f3)"
    actual_patch_version="$(echo ${actual_version} | cut -d '.' -f3)"

    if (( ${expected_major_version} != ${actual_major_version} )) ; then
        echo_failure "Error: ${tool} ${actual_version} does not meet version requirements ${expected_version}"
        FAILURE="true"
        return
    fi

    if (( ${expected_minor_version} > ${actual_minor_version} )) ; then
        echo_failure "Error: ${tool} ${actual_version} does not meet version requirements ${expected_version}"
        FAILURE="true"
        return
    fi

    if (( ${expected_patch_version} > ${actual_patch_version} )) ; then
        echo_failure "Error: ${tool} ${actual_version} does not meet version requirements ${expected_version}"
        FAILURE="true"
        return
    fi

    echo_success "${tool} up to date!"
}


function main {
    verify "git"     "2.0.0"  "git --version | cut -d ' ' -f3"
    verify "just"    "1.0.0" "just --version | cut -d ' ' -f2"
    verify "node"    "16.0.0" "node --version | sed 's/v//g'"
    verify "npm"     "8.0.0"  "npm --version"
    verify "python"  "3.9.0"  "python --version | cut -d ' ' -f2"

    if [ "${FAILURE}" != "false" ]; then
        echo_failure "Error: not all tools were up to date"
        exit 1
    else
        echo_uptodate "Success: all tools are up to date"
    fi

}

main

