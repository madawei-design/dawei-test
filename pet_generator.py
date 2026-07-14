"""程序化卡通宠物图片生成器。

使用 Pillow 通过几何图形（椭圆、多边形、线条）组合绘制可爱的卡通宠物。
每次生成都是随机的：宠物种类、配色、表情、装饰各不相同。
"""

import math
import random
from dataclasses import dataclass, field
from typing import List, Tuple

from PIL import Image, ImageDraw, ImageFilter


IMG_SIZE = 512


# 柔和的调色板：身体颜色、肚子颜色、背景渐变色
BODY_PALETTES = [
    {"body": (255, 178, 102), "belly": (255, 224, 178), "name": "橙色"},
    {"body": (120, 144, 200), "belly": (200, 210, 240), "name": "蓝色"},
    {"body": (130, 200, 150), "belly": (210, 240, 215), "name": "绿色"},
    {"body": (200, 140, 190), "belly": (240, 215, 235), "name": "粉色"},
    {"body": (220, 220, 225), "belly": (245, 245, 248), "name": "银色"},
    {"body": (170, 130, 90), "belly": (220, 200, 170), "name": "棕色"},
    {"body": (250, 220, 120), "belly": (255, 240, 190), "name": "黄色"},
    {"body": (160, 160, 175), "belly": (215, 215, 225), "name": "灰色"},
]

BG_COLORS = [
    (255, 236, 210), (214, 240, 255), (230, 255, 230),
    (255, 220, 235), (240, 230, 255), (255, 250, 220),
]

EYE_STYLES = ["round", "happy", "sleepy", "sparkle"]
MOUTH_STYLES = ["smile", "open", "cat3", "tongue"]
ACCESSORIES = [None, "bowtie", "hat", "flower", "glasses", "scarf"]

PET_TYPES = ["cat", "dog", "bunny", "bear", "fox", "panda"]


@dataclass
class PetConfig:
    pet_type: str
    palette: dict
    bg_color: Tuple[int, int, int]
    eye_style: str
    mouth_style: str
    accessory: str
    blush: bool = True
    spots: List[Tuple[int, int, int]] = field(default_factory=list)


def random_config() -> PetConfig:
    cfg = PetConfig(
        pet_type=random.choice(PET_TYPES),
        palette=random.choice(BODY_PALETTES),
        bg_color=random.choice(BG_COLORS),
        eye_style=random.choice(EYE_STYLES),
        mouth_style=random.choice(MOUTH_STYLES),
        accessory=random.choice(ACCESSORIES),
    )
    # 随机身上的斑点
    if random.random() < 0.5:
        n = random.randint(1, 3)
        cfg.spots = [
            (
                random.randint(150, 360),
                random.randint(300, 400),
                random.randint(15, 30),
            )
            for _ in range(n)
        ]
    return cfg


def _vertical_gradient(size, top, bottom):
    """生成竖直渐变背景。"""
    base = Image.new("RGB", size, top)
    top_img = Image.new("RGB", size, top)
    bottom_img = Image.new("RGB", size, bottom)
    mask = Image.new("L", size)
    md = mask.load()
    w, h = size
    for y in range(h):
        for x in range(w):
            md[x, y] = int(255 * (y / h))
    base = Image.composite(bottom_img, top_img, mask)
    return base


def _draw_ellipse(draw, bbox, fill, outline=None, width=1):
    draw.ellipse(bbox, fill=fill, outline=outline, width=width)


def _draw_ears(draw, cfg, cx, head_r, head_top):
    body = cfg.palette["body"]
    inner = cfg.palette["belly"]
    pt = cfg.pet_type
    if pt == "cat" or pt == "fox":
        # 三角尖耳
        for sign in (-1, 1):
            base_x = cx + sign * head_r * 0.6
            tip_x = cx + sign * head_r * 0.95
            pts = [
                (base_x, head_top + head_r * 0.1),
                (tip_x, head_top - head_r * 0.45),
                (base_x + sign * head_r * 0.3, head_top + head_r * 0.55),
            ]
            draw.polygon(pts, fill=body)
            # 内耳
            inner_pts = [
                (base_x + sign * head_r * 0.05, head_top + head_r * 0.25),
                (tip_x - sign * head_r * 0.1, head_top - head_r * 0.2),
                (base_x + sign * head_r * 0.25, head_top + head_r * 0.45),
            ]
            draw.polygon(inner_pts, fill=inner)
    elif pt == "bunny":
        # 长椭圆耳
        for sign in (-1, 1):
            ex = cx + sign * head_r * 0.45
            ear_bbox = [
                ex - head_r * 0.18,
                head_top - head_r * 0.95,
                ex + head_r * 0.18,
                head_top + head_r * 0.5,
            ]
            _draw_ellipse(draw, ear_bbox, body)
            inner_bbox = [
                ex - head_r * 0.08,
                head_top - head_r * 0.8,
                ex + head_r * 0.08,
                head_top + head_r * 0.35,
            ]
            _draw_ellipse(draw, inner_bbox, inner)
    elif pt == "dog":
        # 下垂椭圆耳
        for sign in (-1, 1):
            ex = cx + sign * head_r * 0.85
            ear_bbox = [
                ex - head_r * 0.3,
                head_top + head_r * 0.1,
                ex + head_r * 0.3,
                head_top + head_r * 1.05,
            ]
            _draw_ellipse(draw, ear_bbox, body)
    else:
        # bear / panda: 小圆耳
        for sign in (-1, 1):
            ex = cx + sign * head_r * 0.75
            ey = head_top - head_r * 0.05
            r = head_r * 0.32
            _draw_ellipse(draw, [ex - r, ey - r, ex + r, ey + r], body)
            if pt == "panda":
                _draw_ellipse(
                    draw,
                    [ex - r * 0.5, ey - r * 0.5, ex + r * 0.5, ey + r * 0.5],
                    inner,
                )


def _draw_eyes(draw, cfg, cx, eye_y, eye_spacing, eye_r):
    eye_r = int(eye_r)
    white = (255, 255, 255)
    black = (40, 40, 50)
    highlight = (255, 255, 255)
    style = cfg.eye_style
    for sign in (-1, 1):
        ex = cx + sign * eye_spacing
        if style == "sleepy":
            # 闭眼弧线
            draw.arc(
                [int(ex - eye_r), int(eye_y - eye_r * 0.6), int(ex + eye_r), int(eye_y + eye_r * 0.6)],
                start=20, end=160, fill=black, width=max(2, eye_r // 4),
            )
        elif style == "happy":
            # 笑眼弧线（向上弯）
            draw.arc(
                [int(ex - eye_r), int(eye_y - eye_r), int(ex + eye_r), int(eye_y + eye_r)],
                start=200, end=340, fill=black, width=max(2, eye_r // 3),
            )
        else:
            _draw_ellipse(draw, [ex - eye_r, eye_y - eye_r, ex + eye_r, eye_y + eye_r], white)
            _draw_ellipse(
                draw,
                [ex - eye_r * 0.7, eye_y - eye_r * 0.7, ex + eye_r * 0.7, eye_y + eye_r * 0.7],
                black,
            )
            if style == "sparkle":
                hx, hy = ex - eye_r * 0.3, eye_y - eye_r * 0.3
                hr = max(1, eye_r // 3)
                _draw_ellipse(draw, [hx - hr, hy - hr, hx + hr, hy + hr], highlight)
            # 通用高光
            hx, hy = ex + eye_r * 0.25, eye_y + eye_r * 0.25
            hr = max(1, eye_r // 4)
            _draw_ellipse(draw, [hx - hr, hy - hr, hx + hr, hy + hr], highlight)


def _draw_mouth(draw, cfg, cx, mouth_y, size):
    size = int(size)
    black = (40, 40, 50)
    tongue = (255, 150, 170)
    style = cfg.mouth_style
    half = size
    if style == "smile":
        draw.arc(
            [int(cx - half), int(mouth_y - half), int(cx + half), int(mouth_y + half)],
            start=20, end=160, fill=black, width=max(2, size // 4),
        )
    elif style == "open":
        _draw_ellipse(draw, [cx - half, mouth_y - half * 0.6, cx + half, mouth_y + half], black)
        _draw_ellipse(draw, [cx - half * 0.5, mouth_y + half * 0.3, cx + half * 0.5, mouth_y + half], tongue)
    elif style == "tongue":
        draw.arc(
            [int(cx - half), int(mouth_y - half), int(cx + half), int(mouth_y + half)],
            start=20, end=160, fill=black, width=max(2, size // 4),
        )
        _draw_ellipse(draw, [cx - half * 0.4, mouth_y, cx + half * 0.4, mouth_y + half * 1.1], tongue)
    else:  # cat3: w 形嘴
        draw.line(
            [(int(cx - half), int(mouth_y - half * 0.4)), (int(cx - half * 0.4), int(mouth_y + half * 0.5))],
            fill=black, width=max(2, size // 4),
        )
        draw.line(
            [(int(cx - half * 0.4), int(mouth_y + half * 0.5)), (int(cx), int(mouth_y - half * 0.2))],
            fill=black, width=max(2, size // 4),
        )
        draw.line(
            [(int(cx), int(mouth_y - half * 0.2)), (int(cx + half * 0.4), int(mouth_y + half * 0.5))],
            fill=black, width=max(2, size // 4),
        )
        draw.line(
            [(int(cx + half * 0.4), int(mouth_y + half * 0.5)), (int(cx + half), int(mouth_y - half * 0.4))],
            fill=black, width=max(2, size // 4),
        )


def _draw_accessory(draw, cfg, cx, neck_y, size):
    black = (40, 40, 50)
    acc = cfg.accessory
    if acc == "bowtie":
        red = (220, 70, 80)
        for sign in (-1, 1):
            pts = [
                (cx, neck_y),
                (cx + sign * size, neck_y - size * 0.6),
                (cx + sign * size, neck_y + size * 0.6),
            ]
            draw.polygon(pts, fill=red)
        _draw_ellipse(draw, [cx - size * 0.25, neck_y - size * 0.25, cx + size * 0.25, neck_y + size * 0.25], red, outline=black, width=2)
    elif acc == "hat":
        # 派对帽
        colors = [(220, 70, 80), (80, 160, 220), (250, 200, 80)]
        pts = [(cx - size, neck_y), (cx + size, neck_y), (cx, neck_y - size * 2.2)]
        draw.polygon(pts, fill=colors[0])
        draw.line([(cx - size, neck_y), (cx, neck_y - size * 2.2)], fill=colors[1], width=max(2, size // 3))
        _draw_ellipse(draw, [cx - size * 0.3, neck_y - size * 2.5, cx + size * 0.3, neck_y - size * 1.9], colors[2])
    elif acc == "flower":
        # 头顶花
        fx, fy = cx - size * 1.6, neck_y - size * 2.4
        petal_c = (250, 120, 170)
        r = size * 0.4
        for ang in range(0, 360, 72):
            a = math.radians(ang)
            px = fx + math.cos(a) * r
            py = fy + math.sin(a) * r
            _draw_ellipse(draw, [px - r, py - r, px + r, py + r], petal_c)
        _draw_ellipse(draw, [fx - r * 0.6, fy - r * 0.6, fx + r * 0.6, fy + r * 0.6], (255, 220, 100))
    elif acc == "glasses":
        # 眼镜放在眼睛区域稍下方
        glass_c = (70, 70, 90)
        for sign in (-1, 1):
            ex = cx + sign * size * 1.1
            _draw_ellipse(draw, [ex - size * 0.7, neck_y - size * 2.6, ex + size * 0.7, neck_y - size * 1.4], None, outline=glass_c, width=max(2, size // 4))
        draw.line([(cx - size * 0.4, neck_y - size * 2), (cx + size * 0.4, neck_y - size * 2)], fill=glass_c, width=max(2, size // 4))
    elif acc == "scarf":
        c = (90, 170, 120)
        draw.rectangle([cx - size * 1.6, neck_y - size * 0.4, cx + size * 1.6, neck_y + size * 0.5], fill=c)
        # 流苏
        for i in range(-1, 2):
            draw.rectangle(
                [cx + i * size * 0.7 - size * 0.15, neck_y + size * 0.5, cx + i * size * 0.7 + size * 0.15, neck_y + size * 1.0],
                fill=c,
            )


def _draw_paws(draw, cfg, body_cx, body_bottom, body_w):
    body = cfg.palette["body"]
    paw_r = body_w * 0.18
    paw_y = body_bottom - paw_r * 0.3
    for sign in (-1, 1):
        px = body_cx + sign * body_w * 0.32
        _draw_ellipse(draw, [px - paw_r, paw_y - paw_r, px + paw_r, paw_y + paw_r], body)


def generate_pet_image(config: PetConfig = None) -> Tuple[Image.Image, PetConfig]:
    """根据配置生成一张宠物图片，返回 (图片, 配置)。"""
    if config is None:
        config = random_config()

    body = config.palette["body"]
    belly = config.palette["belly"]

    # 背景渐变
    top = config.bg_color
    bottom = tuple(max(0, c - 25) for c in config.bg_color)
    img = _vertical_gradient((IMG_SIZE, IMG_SIZE), top, bottom)
    draw = ImageDraw.Draw(img, "RGBA")

    cx = IMG_SIZE // 2

    # ---- 身体 ----
    body_w = 150
    body_h = 150
    body_cx = cx
    body_top = 250
    body_bottom = body_top + body_h
    _draw_ellipse(
        draw,
        [body_cx - body_w, body_top, body_cx + body_w, body_bottom],
        body,
    )
    # 肚子
    _draw_ellipse(
        draw,
        [body_cx - body_w * 0.55, body_top + body_h * 0.35, body_cx + body_w * 0.55, body_bottom + 10],
        belly,
    )
    # 斑点
    for sx, sy, sr in config.spots:
        _draw_ellipse(draw, [sx - sr, sy - sr, sx + sr, sy + sr], tuple(c // 2 + 40 for c in body))

    _draw_paws(draw, config, body_cx, body_bottom, body_w)

    # ---- 头部 ----
    head_r = 115
    head_cx = cx
    head_cy = 175
    head_top = head_cy - head_r

    _draw_ears(draw, config, head_cx, head_r, head_top)

    # 熊猫特殊：白色头 + 黑眼圈
    head_fill = belly if config.pet_type == "panda" else body
    _draw_ellipse(
        draw,
        [head_cx - head_r, head_top, head_cx + head_r, head_cy + head_r],
        head_fill,
    )

    # 脸颊（口鼻区）
    if config.pet_type != "panda":
        _draw_ellipse(
            draw,
            [head_cx - head_r * 0.5, head_cy + head_r * 0.2, head_cx + head_r * 0.5, head_cy + head_r * 0.85],
            belly,
        )

    # 腮红
    if config.blush:
        blush_c = (255, 170, 180, 140)
        for sign in (-1, 1):
            bx = head_cx + sign * head_r * 0.6
            by = head_cy + head_r * 0.35
            br = head_r * 0.18
            _draw_ellipse(draw, [bx - br, by - br, bx + br, by + br], blush_c)

    # ---- 眼睛 ----
    eye_y = head_cy - head_r * 0.05
    eye_spacing = head_r * 0.38
    eye_r = head_r * 0.16

    if config.pet_type == "panda":
        # 黑眼圈
        for sign in (-1, 1):
            ex = head_cx + sign * eye_spacing
            _draw_ellipse(
                draw,
                [ex - eye_r * 1.5, eye_y - eye_r * 1.8, ex + eye_r * 1.5, eye_y + eye_r * 1.8],
                (40, 40, 50),
            )

    _draw_eyes(draw, config, head_cx, eye_y, eye_spacing, eye_r)

    # ---- 鼻子 ----
    nose_y = head_cy + head_r * 0.4
    nose_c = (60, 50, 60)
    if config.pet_type == "dog" or config.pet_type == "bear":
        _draw_ellipse(
            draw,
            [head_cx - head_r * 0.16, nose_y - head_r * 0.1, head_cx + head_r * 0.16, nose_y + head_r * 0.12],
            nose_c,
        )
    else:
        # 小三角鼻
        draw.polygon(
            [
                (head_cx, nose_y - head_r * 0.05),
                (head_cx - head_r * 0.1, nose_y + head_r * 0.08),
                (head_cx + head_r * 0.1, nose_y + head_r * 0.08),
            ],
            fill=nose_c,
        )

    # ---- 嘴 ----
    mouth_y = nose_y + head_r * 0.22
    _draw_mouth(draw, config, head_cx, mouth_y, head_r * 0.16)

    # ---- 胡须（猫/狗/狐狸）----
    if config.pet_type in ("cat", "fox"):
        whisker = (90, 80, 90, 180)
        for sign in (-1, 1):
            base_x = head_cx + sign * head_r * 0.12
            for off in (-0.1, 0.05, 0.2):
                draw.line(
                    [(base_x, nose_y + head_r * off), (head_cx + sign * head_r * 0.95, nose_y + head_r * (off - 0.05))],
                    fill=whisker, width=2,
                )

    # ---- 装饰 ----
    neck_y = body_top - 5
    _draw_accessory(draw, config, cx, neck_y, 26)

    # 轻微柔化，让边缘更可爱
    img = img.filter(ImageFilter.SMOOTH)

    return img, config


def config_summary(config: PetConfig) -> dict:
    """返回配置的可读摘要，供前端展示。"""
    return {
        "pet_type": config.pet_type,
        "color": config.palette["name"],
        "eye_style": config.eye_style,
        "mouth_style": config.mouth_style,
        "accessory": config.accessory or "无",
        "blush": "有" if config.blush else "无",
    }
