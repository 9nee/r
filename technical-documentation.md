# Notes for further development

If there's a large css constant somewhere in the additions, move it to custom_modules/custom_css_injection following the existing format.

try to keep githubLoader non-loader code to a minimum, staging-phase can be held there but ideally it then gets moved to a module loaded by XaeModules.

XaeModules are order-sensitive.

Mahjong mode adds a new socket listener so it might be a good idea to allow disabling it.
