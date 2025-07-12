  # Source your original config
  [[ -f ~/.zshrc ]] && source ~/.zshrc

  # Prepend plain white (nix-shell) to the existing prompt
  PROMPT="%F{white}(nix-shell)%f $PROMPT"
