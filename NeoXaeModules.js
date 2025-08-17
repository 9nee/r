const ModuleLoaderOptions = 
{
    playlist: {
        collapse: false,
        hidePlaylist: true,
        inlineBlame: true,
        moveReporting: false,
        quickQuality: false,
        recentMedia: true,
        simpleLeader: true,
        syncCheck: true,
        thumbnails: true,
        timeEstimates: true,
        userlist: { autoHider: true },
        smartScroll: false,
        maxMessages: 120
    },
}

class NeoXaeModuleLoader {
    #modulePaths
    #moduleObjects;
    #options;
    #state;
    #clientRank;

    constructor(modulePaths) {
        this.#modulePaths = modulePaths
        this.#moduleObjects = null;
        this.#options = ModuleLoaderOptions;
        this.#state = { prev: "", pos: 0 };
        this.#clientRank = CLIENT.rank;
        this.allModulesLoaded = null;
    }

    #createModuleObject(moduleName, isActive = 1, rank = -1) {
        return { active: isActive, rank: rank, url: makeLiveCDNLink(`${MODULES_FOLDER}${moduleName}`), done: true};
    }

    #turnPathsIntoModuleObjects(modulePaths) {
        let moduleObjects = {}
        for (const module of modulePaths) {
            if (typeof module === 'string') {
                moduleObjects[module] = this.#createModuleObject(module)
            } else {
                moduleObjects[module.name] = this.#createModuleObject(module.name, module.isActive, module.rank)
            }
        }
        this.#moduleObjects = moduleObjects
    }

    async initialize() {
        if (CLIENT.modules) {
            return;
        }

        this.#turnPathsIntoModuleObjects(this.#modulePaths)
        
        //Idk about any-o-this, chief
        CLIENT.modules = this.#moduleObjects;
        window[CHANNEL.name].modulesOptions = this.#options;
        
        await this.#preloadRegistry();

        this.allModulesLoaded = this.#sequencerLoader();
    }

    async #getScript(moduleName) {
        return new Promise((resolve, reject) => {
            $.getScript({
                url: makeLiveCDNLink(moduleName),
                cache: false,
                success: function(data) {
                    resolve(data);
                },
                error: function(_, textStatus, errorThrown) {
                    reject(new Error(`Failed to load module registry: ${textStatus} - ${errorThrown}`));
                }
            });
        });
    }

    async #preloadRegistry() {
        return this.#getScript(MODULE_REGISTRY);
    }

    #isModuleEligibleForLoading(moduleConfig) {
        return moduleConfig.active && moduleConfig.rank <= this.#clientRank;
    }

    async #sequencerLoader() {
        const moduleLoadPromises = [];
        this.#state.pos = 0;
        this.#state.prev = "";

        for (const moduleName of Object.keys(this.#moduleObjects)) {
            const moduleObject = this.#moduleObjects[moduleName];

            if (!moduleObject || typeof moduleObject !== 'object') {
                continue;
            }

            if (this.#isModuleEligibleForLoading(moduleObject)) {
                this.#state.prev = moduleName;
                this.#state.pos++;

                const moduleImport = this.#getScript(moduleObject.url);

                window.moduleRegistry.markReady(moduleName);

                moduleLoadPromises.push(moduleImport);
            }
        }
        return Promise.all(moduleLoadPromises);
    }
}

export default NeoXaeModuleLoader;