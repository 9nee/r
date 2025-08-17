const XaeModuleLoaderOptions = 
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

class XaeModuleLoader {
    #modulePaths
    #moduleObjects;
    #options;
    #cache;
    #state;
    #clientRank;

    constructor(modulePaths) {
        this.#modulePaths = modulePaths
        this.#moduleObjects = null;
        this.#options = XaeModuleLoaderOptions;
        this.#cache = false;
        this.#state = { prev: "", pos: 0 };
        this.#clientRank = CLIENT.rank;
        this.allModulesLoaded = null;
    }

    #createXaeModuleObject(moduleName, isActive = 1, rank = -1) {
        return { active: isActive, rank: rank, url: makeLiveCDNLink(`${MODULES_FOLDER}${moduleName}`), done: true};
    }

    #turnPathsIntoXaeModules(modules) {
        let modules = {}
        for (const module of ModulePaths) {
            if (typeof module === 'string') {
                modules[module] = this.#createXaeModuleObject(module)
            } else {
                modules[module.name] = this.#createXaeModuleObject(module.name, module.isActive, module.rank)
            }
        }
        this.#moduleObjects = modules
    }

    async initialize() {
        if (CLIENT.modules) {
            return;
        }

        this.#turnPathsIntoXaeModules(this.#modulePaths)
        
        //Idk about this, chief
        CLIENT.modules = this.#moduleObjects;
        window[CHANNEL.name].modulesOptions = this.#options;
        
        await this.#preloadRegistry();

        this.allModulesLoaded = this.#sequencerLoader();
    }

    async #getScript(url, cache) {
        return new Promise((resolve, reject) => {
            $.getScript({
                url: url,
                cache: cache,
                success: function(data) {
                    resolve(data);
                },
                error: function(_, textStatus, errorThrown) {
                    reject(new Error(`Failed to load ${url}: ${textStatus} - ${errorThrown}`));
                }
            });
        });
    }

    async #preloadRegistry() {
        return this.#getScript(makeLiveCDNLink(MODULE_REGISTRY), null, null);
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

                const cache = moduleObject.cache ?? this.#cache;
                moduleLoadPromises.push(this.#getScript(moduleObject.url, null, cache));
            }
        }
        return Promise.all(moduleLoadPromises);
    }
}