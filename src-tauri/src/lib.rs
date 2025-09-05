use serde::{Deserialize, Serialize};
use tauri_plugin_sql::{Migration, MigrationKind};

#[derive(Debug, Serialize, Deserialize)]
pub struct Counter {
    pub id: i64,
    pub name: String,
    pub value: i64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewCounter {
    pub name: String,
    pub value: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateCounter {
    pub id: i64,
    pub name: Option<String>,
    pub value: Option<i64>,
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_counters_table",
            sql: "CREATE TABLE counters (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                value INTEGER NOT NULL DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:counters.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
