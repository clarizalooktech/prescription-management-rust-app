use axum::{Router, routing::{get, post}, extract::State, Json};
use dotenv::dotenv;
use sqlx::PgPool;
use std::net::SocketAddr;

mod db;
mod patient;
mod prescription;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let db_pool = PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to database");

    let app_state = AppState { db: db_pool };

    let app = Router::new()
        .route("/prescriptions", get(prescription::get_prescriptions).post(prescription::add_prescription))
        .route("/patients", get(patient::get_patients).post(patient::add_patient))
        .with_state(app_state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

pub struct AppState {
    db: PgPool,
}

impl AppState {
    pub fn db_pool(&self) -> &PgPool {
        &self.db
    }
}
