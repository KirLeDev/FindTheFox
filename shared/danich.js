/* FindTheFox — Данич: общий SVG с вариантами лица */

window.FTDanich = (function () {
  'use strict';

  var DANICH_BODY =
    '<rect x="55" y="255" width="45" height="65" rx="10" fill="#5A4630"/>' +
    '<rect x="120" y="255" width="45" height="65" rx="10" fill="#5A4630"/>' +
    '<rect x="50" y="308" width="55" height="18" rx="6" fill="#E8E8D8"/>' +
    '<rect x="115" y="308" width="55" height="18" rx="6" fill="#E8E8D8"/>' +
    '<rect x="50" y="318" width="55" height="4" fill="#A67B5B"/>' +
    '<rect x="115" y="318" width="55" height="4" fill="#A67B5B"/>' +
    '<rect x="8" y="175" width="40" height="105" rx="20" fill="#7A8C4A"/>' +
    '<rect x="172" y="175" width="40" height="105" rx="20" fill="#7A8C4A"/>' +
    '<circle cx="28" cy="278" r="17" fill="#E8B98A"/>' +
    '<circle cx="192" cy="278" r="17" fill="#E8B98A"/>' +
    '<path d="M 28 180 Q 28 158 55 152 L 165 152 Q 192 158 192 180 L 192 270 Q 192 285 175 285 L 45 285 Q 28 285 28 270 Z" fill="#7A8C4A"/>' +
    '<path d="M 28 268 Q 110 288 192 268 L 192 278 Q 110 298 28 278 Z" fill="#5F7038"/>' +
    '<ellipse cx="110" cy="95" rx="55" ry="55" fill="#E8B98A"/>' +
    '<path d="M 62 118 Q 62 168 110 178 Q 158 168 158 118 Q 138 148 110 148 Q 82 148 62 118 Z" fill="#6B4423"/>' +
    '<ellipse cx="110" cy="108" rx="8" ry="6" fill="#D89B70"/>' +
    '<path d="M 58 72 Q 58 46 78 38 Q 68 58 66 82 Z" fill="#5A3A1F"/>' +
    '<path d="M 162 72 Q 162 46 142 38 Q 152 58 154 82 Z" fill="#5A3A1F"/>' +
    '<ellipse cx="100" cy="52" rx="22" ry="12" fill="rgba(255,255,255,0.18)"/>' +
    '<ellipse cx="56" cy="98" rx="8" ry="12" fill="#E8B98A"/>' +
    '<ellipse cx="164" cy="98" rx="8" ry="12" fill="#E8B98A"/>';

  var DANICH_FACES = {
    open:
      '<ellipse cx="88" cy="88" rx="5" ry="6" fill="#1a1a1a"/>' +
      '<ellipse cx="132" cy="88" rx="5" ry="6" fill="#1a1a1a"/>' +
      '<circle cx="90" cy="86" r="2" fill="#fff"/>' +
      '<circle cx="134" cy="86" r="2" fill="#fff"/>' +
      '<path d="M 102 122 Q 110 128 118 122" stroke="#8B6B4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    happy:
      '<path d="M 83 92 Q 88 85 93 92" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M 127 92 Q 132 85 137 92" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M 96 118 Q 110 133 124 118" stroke="#8B6B4A" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    worried:
      '<path d="M 83 86 Q 88 92 93 86" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M 127 86 Q 132 92 137 86" stroke="#1a1a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M 100 126 Q 110 122 120 126" stroke="#8B6B4A" stroke-width="2" fill="none" stroke-linecap="round"/>'
  };

  function danichSVG(face, small) {
    return '<svg class="danich-svg' + (small ? ' small' : '') +
      '" viewBox="0 0 220 340" xmlns="http://www.w3.org/2000/svg">' +
      DANICH_BODY + (DANICH_FACES[face] || DANICH_FACES.open) + '</svg>';
  }

  // Заменить содержимое всех [data-danich="лицо"] (data-size="small" — мелкий).
  function renderAll(root) {
    (root || document).querySelectorAll('[data-danich]').forEach(function (el) {
      el.innerHTML = danichSVG(el.dataset.danich, el.dataset.size === 'small');
    });
  }

  return { svg: danichSVG, renderAll: renderAll };
})();
