# Notes for further development

If there's a large css constant somewhere in the additions, move it to custom_modules/custom_css_injection following the existing format.

try to keep githubLoader non-loader code to a minimum, staging-phase can be held there but ideally it then gets moved to a module loaded by XaeModules.

XaeModules are order-sensitive.

Mahjong mode adds a new socket listener so it might be a good idea to allow disabling it.

If you have a circular dependency, or a dependency that appears on a module loaded way later on (or even appears on any module, really, because of good practices) at the end of the module that provides that dependency, you should include a resolved promise like so:

TODO: write code example for it

A good example can be found in mahjongMode.js

## Reverse

In its current implementation reverse is a two-part piece of code
The first is a css rule, and the second is two filter lists.
If one must edit these, this should be taken into account, no "code" regarding the reverse addition can be found in this repo.
