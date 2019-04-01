var activeTable = document.getElementsByClassName('active')[0].dataset.value;

function onEdit() {
  console.log("edit");
}

function onAdd() {
  console.log("add");
}

function onOpenForm() {
  document.getElementById(activeTable + "-overlay").style.display = "block";
}

function onCloseForm() {
  document.getElementById(activeTable + "-overlay").style.display = "none";
}

// szczegóły pacjenta - zmiana wyświtlanych informacji
function onSwitchTabs(tab) {
  var tab1 = document.getElementById("tab-1");
  var tab2 = document.getElementById("tab-2");

  if(tab === 2) {
    tab1.style.display = "block";
    tab2.style.display = "none";
  }
  else {
    tab1.style.display = "none";
    tab2.style.display = "block";
  }
}

// wyszukiwanie w tabeli
function onSearch() {
  var input = document.getElementsByClassName("search-bar")[0];
  var filter = input.value.toLowerCase();
  var tr = document.getElementsByTagName("tr");

  var txtValue, td, match;
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    match = false;
    for(j = 0; j < td.length; j++) {
      if (td[j]) {
        txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
          match = true;
        }
      }
    }
    if(match) tr[i].style.display = "";
    else tr[i].style.display = "none";
  }
}

// walidacja formularzy
(function() {
  'use strict';
  window.addEventListener('load', function() {
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();


// ========================================== TU SIĘ ZACZYNA PRAWDZIWA ZABAWA ==========================================
