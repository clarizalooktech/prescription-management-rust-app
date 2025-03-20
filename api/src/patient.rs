use axum::{extract::State, Json};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::AppState;

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Patient {
    pub id: i32,
    pub name: String,
    pub age: i32,
}

pub async fn get_patients(State(state): State<AppState>) -> Json<Vec<Patient>> {
    let patients = sqlx::query_as::<_, Patient>("SELECT * FROM patients")
        .fetch_all(state.db_pool())
        .await
        .expect("Failed to fetch patients");

    Json(patients)
}

pub async fn add_patient(
    State(state): State<AppState>,
    Json(patient): Json<Patient>
) -> Json<Patient> {
    let inserted = sqlx::query_as::<_, Patient>(
        "INSERT INTO patients (name, age) VALUES ($1, $2) RETURNING *"
    )
    .bind(&patient.name)
    .bind(patient.age)
    .fetch_one(state.db_pool())
    .await
    .expect("Failed to insert patient");

    Json(inserted)
}
