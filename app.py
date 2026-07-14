"""宠物图片生成 Web 应用。

启动后访问 http://127.0.0.1:5000 ，点击按钮即可生成随机卡通宠物图片。
"""

import base64
import io

from flask import Flask, jsonify, render_template

from pet_generator import generate_pet_image, random_config, config_summary

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate")
def generate():
    img, cfg = generate_pet_image()
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return jsonify(
        {
            "image": "data:image/png;base64," + b64,
            "info": config_summary(cfg),
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
