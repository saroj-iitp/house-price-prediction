from flask import Flask, render_template, request, redirect, url_for
import joblib
import pandas as pd

app = Flask(__name__)
model = joblib.load('linear_regression_model.pkl')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict')
def predict_page():
    return render_template('predict.html')

@app.route('/result', methods=['POST'])
def result():
    area = float(request.form.get('area'))
    floors = int(request.form.get('number_of_floors'))
    material = request.form.get('material')
    rooms = int(request.form.get('rooms'))
    bathrooms = int(request.form.get('bathrooms'))
    parking = 1 if request.form.get('parking') == 'yes' else 0
    furnishing = request.form.get('furnishing')
    construction = request.form.get('construction_type')
    road = request.form.get('road_condition')
    
    features = request.form.getlist('features')
    basement = int('Basement' in features)
    terrace = int('Terrace' in features)
    garden = int('Garden' in features)
    swimming = int('Swimming Pool' in features)

    interior = request.form.getlist('interior')
    interior_work = int(bool(interior))

    data = {
        'area_sqft': area,
        'floors': floors,
        'rooms_per_floor': rooms,
        'bathrooms_per_floor': bathrooms,
        'material_quality_Low': int(material == 'standard'),
        'material_quality_Medium': int(material == 'premium'),
        'material_quality_Premium': int(material == 'luxury'),
        'construction_type_Farmhouse': int(construction == 'Farmhouse'),
        'construction_type_Residential': int(construction == 'Residential'),
        'construction_type_Villa': int(construction == 'Villa'),
        'has_parking_Yes': parking,
        'furnishing_Semi-Furnished': int(furnishing == 'Semi-Furnished'),
        'furnishing_Unfurnished': int(furnishing == 'Unfurnished'),
        'road_type_Moderate': int(road == 'Moderately Busy Road'),
        'road_type_Narrow': int(road == 'Quiet Residential Road'),
        'road_type_Wide': int(road == 'Busy Main Road'),
        'basement_Yes': basement,
        'terrace_Yes': terrace,
        'garden_Yes': garden,
        'swimming_pool_Yes': swimming,
        'interior_work_Yes': interior_work,
        'location_category_Tier 1': 1,
        'location_category_Tier 2': 0
    }

    order = [
        'area_sqft', 'floors', 'rooms_per_floor', 'bathrooms_per_floor',
        'material_quality_Low', 'material_quality_Medium', 'material_quality_Premium',
        'construction_type_Farmhouse', 'construction_type_Residential', 'construction_type_Villa',
        'has_parking_Yes', 'furnishing_Semi-Furnished', 'furnishing_Unfurnished',
        'road_type_Moderate', 'road_type_Narrow', 'road_type_Wide',
        'basement_Yes', 'terrace_Yes', 'garden_Yes', 'swimming_pool_Yes',
        'interior_work_Yes', 'location_category_Tier 1', 'location_category_Tier 2'
    ]

    X = pd.DataFrame([[data[col] for col in order]], columns=order)
    prediction = model.predict(X)[0]

    return render_template('result.html', prediction=round(prediction, 2))

@app.route('/schemes')
def schemes():
    return render_template('schemes.html')

@app.route('/tips')
def tips():
    return render_template('tips.html')

@app.route('/calculator')
def calculator():
    return render_template('calculator.html')

@app.route('/contacts')
def contacts():
    return render_template('contacts.html')

@app.route('/breakdown')
def breakdown():
    base_value = request.args.get('base', type=float)
    if base_value is None:
        return redirect(url_for('predict_page'))
    return render_template('breakdown.html', base=base_value)

if __name__ == '__main__':
    app.run(debug=True)
