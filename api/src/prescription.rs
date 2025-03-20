use axum::{extract::State, Json};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::AppState;

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct Prescription {
    pub id: i32,
    pub patient_id: i32,
    pub medication: String,
    pub dosage: String,
}

pub async fn get_prescriptions(State(state): State<AppState>) -> Json<Vec<Prescription>> {
    let prescriptions = sqlx::query_as::<_, Prescription>("SELECT * FROM prescriptions")
        .fetch_all(state.db_pool())
        .await
        .expect("Failed to fetch prescriptions");

    Json(prescriptions)
}

pub async fn add_prescription(
    State(state): State<AppState>,
    Json(prescription): Json<Prescription>
) -> Json<Prescription> {
    let inserted = sqlx::query_as::<_, Prescription>(
        "INSERT INTO prescriptions (patient_id, medication, dosage) VALUES ($1, $2, $3) RETURNING *"
    )
    .bind(prescription.patient_id)
    .bind(&prescription.medication)
    .bind(&prescription.dosage)
    .fetch_one(state.db_pool())
    .await
    .expect("Failed to insert prescription");

    Json(inserted)
}
