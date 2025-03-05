default: 
    @just --list

alias b := build
alias d := dev

build: 
    pnpm build

dev: 
    pnpm dev
    