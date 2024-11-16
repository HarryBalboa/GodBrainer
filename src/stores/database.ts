import {defineStore} from "pinia";
import {ref} from "vue";



export const useDatabase = defineStore('useDatabase',  () => {
    const database = ref<IDBDatabase>();
    const setupDB = async () : Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open('BrainBrawl', 1);
            request.onerror = (ev: any) => {
                console.error(`Database error: ${(ev.target).errorCode}`);
                reject(ev);
            };

            request.onsuccess = (ev) => {
                console.info('db connected');
                resolve((ev.target as IDBOpenDBRequest).result);
            };

            request.onupgradeneeded = (ev) => {
                const db = (ev.target as IDBOpenDBRequest).result;
                const userObjectStore = db.createObjectStore('players', {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                userObjectStore.createIndex('name', 'name', { unique: false });

                const gameObjectStore = db.createObjectStore("games", {
                    keyPath: "id",
                    autoIncrement: true
                });
                gameObjectStore.createIndex("name", "name", { unique: false });

                const questionObjectStore = db.createObjectStore("questions", {
                    keyPath: "id",
                    autoIncrement: true
                });
                questionObjectStore.createIndex("name", "name", { unique: false });
            };
        });
    };

    const getPlayers = async ()  =>{
        return new Promise((resolve, reject) => {
            const playerRequest = database.value!
                .transaction('users')
                .objectStore('users')
                .getAll();

            playerRequest.onerror = (ev : any) => {
                console.error(`Database error: ${ev.target.errorCode}`);
                reject(ev);
            };

            playerRequest.onsuccess = (ev) => {
                resolve((ev.target as IDBOpenDBRequest).result);
            };
        }) as Promise<unknown> as Promise<(TPlayer & TDBEntry)[]>;
    }
    const getPlayer  = async (playerId : number) => {
        return new Promise((resolve, reject) => {
            const playerRequest = database.value!
                .transaction('users')
                .objectStore('users')
                .get(playerId);

            playerRequest.onerror = (ev : any) => {
                console.error(`Database error: ${ev.target.errorCode}`);
                reject(ev);
            };

            playerRequest.onsuccess = (ev) => {
                resolve((ev.target as IDBOpenDBRequest).result);
            };
        }) as Promise<unknown> as Promise<(TPlayer & TDBEntry)>;
    };
    const addPlayer = async (player: TPlayer) => {
        return new Promise((resolve, reject) => {
            const request = database.value!
                .transaction(['users'], 'readwrite')
                .objectStore('users')
                .add(player);

            request.onerror = (ev :any) => {
                console.error(ev.target.errorCode);
                reject(ev);
            };

            request.onsuccess = (ev) => {
                console.info('saved to db');
                resolve(ev);
            };
        });
    };
    const removePlayer = async (playerId: number) => {
        return new Promise((resolve, reject) => {
            const request = database.value!
                .transaction(['users'], 'readwrite')
                .objectStore('users')
                .delete(playerId);

            request.onerror = (ev:any) => {
                console.error(ev.target.errorCode);
                reject(ev);
            };

            request.onsuccess = (ev) => {
                console.info('saved to db');
                resolve(ev);
            };
        });
    }
    const updatePlayer = async (player: TPlayer & TDBEntry) => {
        return new Promise((resolve, reject) => {
            const request = database.value!
                .transaction(['users'], 'readwrite')
                .objectStore('users')
                .put(player);

            request.onerror = (ev : any) => {
                console.error(ev.target.errorCode);
                reject(ev);
            };

            request.onsuccess = (ev) => {
                console.info('saved to db');
                resolve(ev);
            };
        });
    }

    const getGames = async () =>{
        return new Promise((resolve, reject) => {
            const userRequest = database.value!
                .transaction('games')
                .objectStore('games')
                .getAll();

            userRequest.onerror = (ev : any) => {
                console.error(`Database error: ${ev.target.errorCode}`);
                reject(ev);
            };

            userRequest.onsuccess = (ev) => {
                resolve((ev.target as IDBOpenDBRequest).result);
            };
        }) as Promise<unknown> as Promise<((TBasicGame | TJeopardyGame) & TDBEntry)[]>;
    }
    const getGame = async (gameId : number) => {
        return new Promise((resolve, reject) => {
            const userRequest = database.value!
                .transaction('games')
                .objectStore('games')
                .get(gameId);

            userRequest.onerror = (ev : any) => {
                console.error(`Database error: ${ev.target.errorCode}`);
                reject(ev);
            };

            userRequest.onsuccess = (ev) => {
                resolve((ev.target as IDBOpenDBRequest).result);
            };
        }) as Promise<unknown> as Promise<((TBasicGame | TJeopardyGame) & TDBEntry)>;
    }
    const addGame = async (game: TBasicGame | TJeopardyGame) => {
        return new Promise((resolve, reject) => {
            const request = database.value!
                .transaction(['games'], 'readwrite')
                .objectStore('games')
                .add(game);

            request.onerror = (ev : any) => {
                console.error(ev.target.errorCode);
                reject(ev);
            };

            request.onsuccess = (ev) => {
                console.info('saved to db');
                resolve(ev);
            };
        });
    }
    const removeGame = async (gameId : number) => {
        return new Promise((resolve, reject) => {
            const request = database.value!
                .transaction(['games'], 'readwrite')
                .objectStore('games')
                .delete(gameId);

            request.onerror = (ev : any) => {
                console.error(ev.target.errorCode);
                reject(ev);
            };

            request.onsuccess = (ev) => {
                console.info('saved to db');
                resolve(ev);
            };
        });
    }
    const updateGame = async (game: (TBasicGame | TJeopardyGame) & TDBEntry) => {
        return new Promise((resolve, reject) => {
            const request = database.value!
                .transaction(['games'], 'readwrite')
                .objectStore('games')
                .put(game);

            request.onerror = (ev : any) => {
                console.error(ev.target.errorCode);
                reject(ev);
            };

            request.onsuccess = (ev) => {
                console.info('saved to db');
                resolve(ev);
            };
        });
    }

    const getQuestions =  async () =>{
        return new Promise((resolve, reject) => {
            const userRequest = database.value!
                .transaction('questions')
                .objectStore('questions')
                .getAll();

            userRequest.onerror = (ev : any) => {
                console.error(`Database error: ${ev.target.errorCode}`);
                reject(ev);
            };

            userRequest.onsuccess = (ev) => {
                resolve((ev.target as IDBOpenDBRequest).result);
            };
        })as Promise<unknown> as Promise<(TQuestion & TDBEntry)[]>;
    }
    const getQuestion = async (questionId : number) => {
        return new Promise((resolve, reject) => {
            const userRequest = database.value!
                .transaction('questions')
                .objectStore('questions')
                .get(questionId);

            userRequest.onerror = (ev : any) => {
                console.error(`Database error: ${ev.target.errorCode}`);
                reject(ev);
            };

            userRequest.onsuccess = (ev) => {
                resolve((ev.target as IDBOpenDBRequest).result);
            };
        }) as Promise<unknown> as Promise<(TQuestion & TDBEntry)>;
    }
    const addQuestion = async (question : TQuestion) => {
        return new Promise((resolve, reject) => {
            const request = database.value!
                .transaction(['questions'], 'readwrite')
                .objectStore('questions')
                .add(question);

            request.onerror = (ev : any) => {
                console.error(ev.target.errorCode);
                reject(ev);
            };

            request.onsuccess = (ev) => {
                console.info('saved to db');
                resolve(ev);
            };
        });
    }
    const removeQuestion = async (questionId: number) => {
        return new Promise((resolve, reject) => {
            const request = database.value!
                .transaction(['questions'], 'readwrite')
                .objectStore('questions')
                .delete(questionId);

            request.onerror = (ev : any) => {
                console.error(ev.target.errorCode);
                reject(ev);
            };

            request.onsuccess = (ev) => {
                console.info('saved to db');
                resolve(ev);
            };
        });
    }
    const updateQuestion = async (question: TQuestion & TDBEntry) => {
        return new Promise((resolve, reject) => {
            const request = database.value!
                .transaction(['questions'], 'readwrite')
                .objectStore('questions')
                .put(question);

            request.onerror = (ev : any) => {
                console.error(ev.target.errorCode);
                reject(ev);
            };

            request.onsuccess = (ev) => {
                console.info('saved to db');
                resolve(ev);
            };
        });
    }

    return {
        database,
        setupDB,
        getPlayers,
        getPlayer,
        addPlayer,
        removePlayer,
        updatePlayer,
        getGames,
        getGame,
        addGame,
        removeGame,
        updateGame,
        getQuestions,
        getQuestion,
        addQuestion,
        removeQuestion,
        updateQuestion,
    }
})