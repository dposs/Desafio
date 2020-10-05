const fs = require("fs");
const dir = require("path");

/**
 * Carregador de Classes.
 * 
 * @class Loader
 */
class Loader {

  /**
   * Inicializa a instancia de Loader.
   * 
   * @static
   * @param {string} [root] Diretorio raiz
   * @returns {Loader}
   * @memberof Loader
   */
  static initialize(root) {
    Loader.instance = new Loader();
    Loader.instance.root = root;
    Loader.instance.classes = [];
    Loader.instance.paths = [];
    Loader.instance.pools = [];
    Loader.instance.mocks = [];

    Loader.instance.require = require;
    
    return Loader.instance;
  }

  /**
   * Retorna a instancia de Loader.
   * 
   * @static
   * @param {string} [root] Diretorio raiz
   * @returns {Loader}
   * @memberof Loader
   */
  static getInstance(root) {
    if (Loader.instance) {
      return Loader.instance;
    }
    return Loader.initialize(root);
  }

  /**
   * Retorna uma Classe.
   * 
   * @static
   * @param {string} name Nome da Classe
   * @returns {Class}
   * @memberof Loader
   */
  static getClass(name) {
    let instance = Loader.instance;
    return instance.getClass.call(instance, name);
  }

  /**
   * Retorna uma Classe.
   * 
   * @param {string} name Nome da Classe
   * @returns {Class}
   * @memberof Loader
   */
  getClass(name) {
    if (this.mocks.hasOwnProperty(name)) {
      return this.mocks[name];
    }

    if (!this.classes.hasOwnProperty(name)) {
      let directories = this.getRootDirectories();    
      
      for (let path of directories) {
        this.load(path, name);
        if (this.classes.hasOwnProperty(name)) break;
      }
    }

    return this.classes[name];
  }

  /**
   * Retorna um pool de Classes.
   * 
   * @param {string} pool 
   * @returns {Class[]}
   * @memberof Loader
   */
  getClasses(pool) {
    if (!this.pools.hasOwnProperty(pool)) {
      return [];
    }
    return this.pools[pool];
  }

  /**
   * Carrega recursivamente todas as classes de um diretorio ou uma classe especifica.
   * 
   * @param {string} path Diretorio (relativo ao diretorio raiz)
   * @param {string} [name] Nome da Classe
   * @param {string} [pool] Pool de Classes
   * @returns {Loader}
   * @memberof Loader
   */
  load(path, name, pool) {
    if (!pool) pool = path;

    if (!this.pools[pool]) {
      this.pools[pool] = [];
    }

    let directory = dir.join(process.cwd(), (this.root ? this.root : ""), path);
    let files = fs.readdirSync(directory);

    for (let file of files) {
      if (fs.lstatSync(dir.join(directory, file)).isDirectory()) {
        this.load(dir.join(path, file), name, pool);

      } else if (file.match(/\.js$/) !== null) {
        file = file.replace(".js", "");

        if (!name || name == file) {
          let path = dir.join(directory, file);
          let cls = this.require(path);

          this.classes[file] = cls;
          this.pools[pool][file] = cls;
          this.paths[file] = path;

          if (name) break;
        }
      }
    }

    if (!name) this.lastPool = this.pools[pool];

    return this;
  }

  /**
   * Recarrega completamente a Classe (removendo-a do cache do Node e do cache do Loader).
   * 
   * @param {string} name 
   * @returns {Loader}
   * @memberof Loader
   */
  reload(name) {
    if (this.paths.hasOwnProperty(name)) {
      delete require.cache[this.paths[name] + ".js"];
      this.clearCache(name);
    }

    this.getClass(name);
    return this;
  }

  /**
   * Remove as classes do ultimo carregamento (pool) conforme os seus nomes.
   * 
   * @param {...string} names 
   * @returns {Loader}
   * @memberof Loader
   */
  except(...names) {
    for (let name of names) {
      delete this.lastPool[name];
      delete this.classes[name];
    }
    return this;
  }

  /**
   * Executa uma Funcao parametrizada ou uma Funcao estatica em todas as classes do ultimo carregamento (pool).
   * 
   * @param {(function(Class)|string)} fn Funcao parametrizada ou Nome da Funcao estatica
   * @param {*} [args] Argumentos da Funcao estatica
   * @returns {Loader}
   * @memberof Loader
   */
  exec(fn, ...args) {
    for (let file in this.lastPool) {
      
      if (typeof fn === "string") {
        if (this.lastPool[file].hasOwnProperty(fn)) {
          this.lastPool[file][fn](...args);
        }
      }

      if (typeof fn === "function") {
        fn(this.lastPool[file]);
      }
    }
    
    return this;
  }

  /**
   * Remove a Classe de todos os caches do Loader (Classes, Paths, Pools e Mocks).
   * Se nao informada uma Classe, remove todas as Classes do cache.
   * 
   * @param {string} [name] Nome da Classe
   * @returns {Loader}
   * @memberof Loader
   */
  clearCache(name) {
    if (name) {
      delete this.classes[name];
      delete this.paths[name];
      delete this.mocks[name];
      pools : for (let pool of Object.keys(this.pools)) {
        if (this.pools[pool].hasOwnProperty(name)) {
          delete this.pools[pool][name];
          break pools;
        }
      }
    } else {
      this.classes = [];
      this.paths = [];
      this.pools = [];
      this.mocks = [];
    }

    return this;
  }

  /**
   * Configura uma Classe substituta (mock) para a Classe de origem.
   * 
   * @param {string} name Nome de Classe
   * @param {Class} cls Classe substituta
   * @returns {Loader}
   * @memberof Loader
   */
  replace(name, cls) {
    this.mocks[name] = cls;
    return this;
  }

  /**
   * Remove a Classe substituta (mock) da Classe de origem.
   * Caso o nome nao for informado, remove todas as Classes substitutas.
   * 
   * @param {string} [name] Nome de Classe
   * @returns {Loader}
   * @memberof Loader
   */
  restore(name) {
    if (name) {
      if (this.mocks[name]) {
        delete this.mocks[name];
      }
    } else {
      this.mocks = [];
    }
    return this;
  }

  /**
   * Retorna todos os diretorios do diretorio raiz.
   * 
   * @returns {string[]} Diretorios
   * @memberof Loader
   */
  getRootDirectories() {
    let directory = dir.join(process.cwd(), (this.root ? this.root : ""));
    let items = fs.readdirSync(directory);
    
    let directories = [];

    for (let item of items) {
      if (fs.lstatSync(dir.join(directory, item)).isDirectory()) {
        directories.push(item);
      }
    }

    return directories;
  }
}

module.exports = Loader;