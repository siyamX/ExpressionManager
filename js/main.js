var csInterface = new CSInterface();
var expressions = [];
var editingId = null;
var copySound = new Audio('./sfx/copy.mp3');
var favoriteSound = new Audio('./sfx/favorite.mp3');
copySound.volume = 0.7;
favoriteSound.volume = 0.7;

var addBtn = document.getElementById('addBtn');
var addForm = document.getElementById('addForm');
var cancelBtn = document.getElementById('cancelBtn');
var saveBtn = document.getElementById('saveBtn');
var exprName = document.getElementById('exprName');
var exprCode = document.getElementById('exprCode');
var expressionsList = document.getElementById('expressionsList');
var searchInput = document.getElementById('searchInput');

setPanelColor();

loadExpressions();

addBtn.addEventListener('click', function () {
  addForm.classList.add('active');
  exprName.focus();
});

cancelBtn.addEventListener('click', function () {
  addForm.classList.remove('active');
  editingId = null;
  clearForm();
});

saveBtn.addEventListener('click', saveExpression);

searchInput.addEventListener('input', function () {
  var searchTerm = this.value.toLowerCase();
  var filteredExpressions = expressions.filter(function (expr) {
    return expr.name.toLowerCase().includes(searchTerm);
  });

  if (filteredExpressions.length === 0 && searchTerm !== '') {
    expressionsList.innerHTML =
      '<div class="empty-state"><p>No matching expressions found</p></div>';
    return;
  }

  if (searchTerm === '') {
    renderExpressions();
    return;
  }

  expressionsList.innerHTML = filteredExpressions
    .map(function (expr) {
      return (
        '<div class="expression-item" data-id="' +
        expr.id +
        '">' +
        '<span class="expression-name">' +
        escapeHtml(expr.name) +
        '</span>' +
        '<div class="item-actions">' +
        '<button class="edit-btn" onclick="editExpression(' +
        expr.id +
        ')" title="Edit Expression">' +
        '<img src="icons/edit.svg" alt="Edit" width="16" height="16">' +
        '</button>' +
        '<button class="copy-btn" onclick="copyExpression(' +
        expr.id +
        ', this)" title="Copy Expression">' +
        '<img src="icons/copy.svg" alt="Copy" width="16" height="16">' +
        '</button>' +
        '<button class="delete-btn" onclick="deleteExpression(' +
        expr.id +
        ')" title="Delete Expression">' +
        '<img src="icons/delete.svg" alt="Delete" width="16" height="16">' +
        '</button>' +
        '</div></div>'
      );
    })
    .join('');
});

function saveExpression() {
  var name = exprName.value.trim();
  var code = exprCode.value.trim();

  if (!name || !code) {
    alert('Please enter both name and expression code');
    return;
  }

  var existingExpr = expressions.find(function (e) {
    return e.id === editingId;
  });

  var expression = {
    id: editingId || Date.now(),
    name: name,
    code: code,
    favorite: existingExpr ? existingExpr.favorite : false,
  };

  if (editingId) {
    expressions = expressions.filter(function (e) {
      return e.id !== editingId;
    });
  }

  expressions.push(expression);
  saveToStorage();
  renderExpressions();

  addForm.classList.remove('active');
  editingId = null;
  clearForm();
}

function clearForm() {
  exprName.value = '';
  exprCode.value = '';
}

function toggleFavorite(id) {
  var expr = expressions.find(function (e) {
    return e.id === id;
  });
  if (!expr) return;

  expr.favorite = !expr.favorite;

  if (expr.favorite) {
    favoriteSound.currentTime = 0;
    favoriteSound.play();
  }

  saveToStorage();
  renderExpressions();
}

function renderExpressions() {
  if (expressions.length === 0) {
    expressionsList.innerHTML =
      '<div class="empty-state"><p>No expressions saved yet</p><p>Click the "+ Add" button to save your first expression</p></div>';
    return;
  }

  var sortedExpressions = expressions.sort(function (a, b) {
    if (a.favorite === b.favorite) {
      return a.name.localeCompare(b.name);
    }
    return b.favorite - a.favorite;
  });

  expressionsList.innerHTML = sortedExpressions
    .map(function (expr) {
      return (
        '<div class="expression-item' +
        (expr.favorite ? ' favorite' : '') +
        '" data-id="' +
        expr.id +
        '">' +
        '<div class="item-actions-left">' +
        '<button class="favorite-btn" onclick="toggleFavorite(' +
        expr.id +
        ')" title="Toggle Favorite">' +
        '<img src="icons/' +
        (expr.favorite ? 'star2.svg' : 'star1.svg') +
        '" alt="Favorite" width="16" height="16">' +
        '</button>' +
        '</div>' +
        '<span class="expression-name">' +
        escapeHtml(expr.name) +
        '</span>' +
        '<div class="item-actions">' +
        '<button class="edit-btn" onclick="editExpression(' +
        expr.id +
        ')" title="Edit Expression">' +
        '<img src="icons/edit.svg" alt="Edit" width="16" height="16">' +
        '</button>' +
        '<button class="copy-btn" onclick="copyExpression(' +
        expr.id +
        ', this)" title="Copy Expression">' +
        '<img src="icons/copy.svg" alt="Copy" width="16" height="16">' +
        '</button>' +
        '<button class="delete-btn" onclick="deleteExpression(' +
        expr.id +
        ')" title="Delete Expression">' +
        '<img src="icons/delete.svg" alt="Delete" width="16" height="16">' +
        '</button>' +
        '</div></div>'
      );
    })
    .join('');
}

function copyExpression(id, button) {
  var expr = expressions.find(function (e) {
    return e.id === id;
  });
  if (!expr) return;

  button.classList.add('copy-animate');
  setTimeout(() => button.classList.remove('copy-animate'), 300);

  copySound.currentTime = 0;
  copySound.play();

  var textarea = document.createElement('textarea');
  textarea.value = expr.code;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
  } catch (e) {
    alert('Failed to copy expression');
  }

  document.body.removeChild(textarea);
}

function deleteExpression(id) {
  if (confirm('Are you sure you want delete this expression?')) {
    expressions = expressions.filter(function (e) {
      return e.id !== id;
    });
    saveToStorage();
    renderExpressions();
  }
}

function editExpression(id) {
  var expr = expressions.find(function (e) {
    return e.id === id;
  });
  if (!expr) return;

  editingId = id;
  exprName.value = expr.name;
  exprCode.value = expr.code;
  addForm.classList.add('active');

  addForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveToStorage() {
  var data = JSON.stringify(expressions);
  csInterface.evalScript('saveExpressions("' + escapeForJSX(data) + '")');
}

function loadExpressions() {
  csInterface.evalScript('loadExpressions()', function (result) {
    if (result && result !== 'undefined') {
      try {
        expressions = JSON.parse(result);
        renderExpressions();
      } catch (e) {
        expressions = [];
      }
    }
  });
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeForJSX(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function setPanelColor() {
  var appSkin = csInterface.getHostEnvironment().appSkinInfo;
  var panelBgColor = appSkin.panelBackgroundColor.color;
  var rgb =
    'rgb(' +
    panelBgColor.red +
    ',' +
    panelBgColor.green +
    ',' +
    panelBgColor.blue +
    ')';
  document.body.style.backgroundColor = rgb;
}

window.deleteExpression = deleteExpression;
window.editExpression = editExpression;
window.toggleFavorite = toggleFavorite;
