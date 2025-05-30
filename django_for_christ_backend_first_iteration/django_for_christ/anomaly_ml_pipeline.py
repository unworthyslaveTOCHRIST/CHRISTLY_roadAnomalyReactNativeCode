# ALL THANKS AND GLORY TO THE AND my ONLY GOD AND LORD JESUS CHRIST ALONE

import os
import django
import time
import joblib
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Graciously setting up Django environment around script
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_for_christ.settings")
django.setup()

from RoadAnomalyManualDataCollection.models import RoadAnomalyManualDataCollection
from RoadAnomalyInput.models import RoadAnomalyInput
from RoadAnomalyInferenceLogs.models import RoadAnomalyInferenceLogs
from RoadAnomalyPredictionOutput.models import RoadAnomalyPredictionOutput
from RoadAnomalyVerification.models import RoadAnomalyVerification

MODEL_PATH = "road_anomaly_model.pkl"

CSV_BACKUP_DIR = "csv_backups"
os.makedirs(CSV_BACKUP_DIR, exist_ok = True)

# Utility: Export model to CSV (avoiding duplicates)
def export_to_csv(django_model, filename):
    df = pd.DataFrame(django_model.objects.all().values())
    if df.empty:
        return

    full_path = os.path.join(CSV_BACKUP_DIR, filename)


    # If file exists, read it and append only new rows (by ID)
    if os.path.exists(full_path):
        existing_df = pd.read_csv(full_path)
        new_rows = df[~df["id"].isin(existing_df["id"])]
        if not new_rows.empty:
            new_rows.to_csv(full_path, mode = "a", header = False, index = False)

    else:
        df.to_csv(full_path, index = False)


# Extracting Training data
def fetch_training_data():
    data = RoadAnomalyManualDataCollection.objects.all().values()
    df = pd.DataFrame(data)
    if df.empty:
        return None, None

    features = df[["acc_x","acc_y","acc_z","rot_x", "rot_y", "rot_z", "speed"]]
    labels = df["anomaly"]
    return features, labels


def train_and_evaluate():
    X,y = fetch_training_data()
    if X is None:
        print("No data available for training.")
        return

    X_train,X_val,y_train,y_val = train_test_split(X, y, test_size = 0.2, random_state = 42)
    clf = RandomForestClassifier(n_estimators=100, random_state = 42)
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_val)
    report = classification_report(y_val, y_pred, output_dict = True)
    print("Classification report:", report)
    model_performance_metrics = report["weighted avg"]
    print("Model's Performance Metrics:", model_performance_metrics)
    f1_score = model_performance_metrics["f1-score"]

    if f1_score >= 0.90:
        joblib.dump(clf, MODEL_PATH)
        print("✅ New model saved.")
    else:
        print("⚠️ F1-Score not sufficient. Model not updated.")

def update_input_main():
    data = RoadAnomalyManualDataCollection.objects.all().values("latitude", "longitude", "anomaly")
    df = pd.DataFrame(data)
    if df.empty:
        return


    grouped = df.groupby(["latitude", "longitude"]).agg(lambda x : x.mode()[0]).reset_index()
    for _,row in grouped.iterrows():
        RoadAnomalyInput.objects.get_or_create(
            latitude = row.latitude,
            longitude = row.longitude,
            anomaly = row.anomaly

        )

def run_predictions():
    if not os.path.exists(MODEL_PATH):
        print("🚫 Model file not found.")
        return

    clf = joblib.load(MODEL_PATH)
    logs = RoadAnomalyInferenceLogs.objects.order_by("id")[:100].values()
    df = pd.DataFrame(logs)
    if df.empty:
        print("No logs to predict")
        return

    features = df[["acc_x", "acc_y", "acc_z", "rot_x", "rot_y", "rot_z", "speed"]] # Graciously getting all rows
    predictions = clf.predict(features)

    for i,row in df.iterrows():
        RoadAnomalyPredictionOutput.objects.create(
            batch_id = row.batch_id
            acc_x=row.acc_x,
            acc_y=row.acc_y,
            acc_z=row.acc_z,
            rot_x=row.rot_x,
            rot_y=row.rot_y,
            rot_z=row.rot_z,
            speed=row.speed,
            latitude=row.latitude,
            longitude=row.longitude,
            accuracy=row.accuracy,
            timestamp=row.timestamp,
            log_interval = row.log_interval
            anomaly_prediction=predictions[i]
        )

    # RoadAnomalyInferenceLogs.objects.all().delete()

def process_verification():
    verifications = RoadAnomalyVerification.objects.all()
    for v in verifications:
        if v.response == "YES":
            RoadAnomalyManualDataCollection.objects.create(
                acc_x=v.acc_x,
                acc_y=v.acc_y,
                acc_z=v.acc_z,
                rot_x=v.rot_x,
                rot_y=v.rot_y,
                rot_z=v.rot_z,
                speed=v.speed,
                latitude=v.latitude,
                longitude=v.longitude,
                accuracy=v.accuracy,
                timestamp=v.timestamp,
                anomaly=v.anomaly_prediction
            )

            v.delete()


        else:
            pass

    RoadAnomalyInferenceLogs.objects.all().delete()
    RoadAnomalyPredictionOutput.objects.all().delete()






if __name__ == "__main__":
    print("⏳ Running periodic training and prediction cycle with backups...")

    while True:
        train_and_evaluate()
        update_input_main()
        run_predictions()
        process_verification()

        # Graciously saving models to CSV (once every cycle)
        export_to_csv(RoadAnomalyManualDataCollection, "manual_data.csv")
        export_to_csv(RoadAnomalyInput, "input_processing.csv")
        time.sleep(1)  #Graciously pause program execution for 1 second







