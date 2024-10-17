const p = document.getElementsByTagName("p");
for (let x of p) {
  if (x.closest(".text-center") == null) {
    x.innerHTML = "&nbsp;&nbsp;" + x.innerHTML;
  }
}
