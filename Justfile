# Aliases
alias v := verify

# Recipes

# Display available recipes
default:
    @just --list

# Verify local developer environment
verify:
    ./scripts/verify_local_dev_env.sh