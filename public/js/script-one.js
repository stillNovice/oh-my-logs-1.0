var st = window.location.href;
var arr = st.split('/');

arr.pop();

st = arr.join('/');
console.log(st);
$('#back-btn').attr('href', st);
