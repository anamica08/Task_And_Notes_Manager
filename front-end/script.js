/*
Set Default date to tommorows date
*/

var date = new Date();
document.getElementById("datePicker").value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
    '-' + (date.getDate() + 1).toString().padStart(2, 0);

/*
Change checkbox status text on the basis of checked or unchecked
*/

function changeText() {
    var checkbox = document.getElementById("inlineCheckbox");
    if (checkbox.checked) {
        document.getElementById("checkbox-label").innerHTML = "Complete";
    } else {
        document.getElementById("checkbox-label").innerHTML = "Incomplete";
    }
}