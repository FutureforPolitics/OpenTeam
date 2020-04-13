
addEventListener("load", function(){
	document.getElementById("form").addEventListener("submit", async function(e){
    e.preventDefault();
		let data = new FormData(document.getElementById("form"));
		let req = await fetch("http://<domain>:10200/v1/auth/register", {method: "POST", body: data, mode: "cors"});
    console.log(req);
	});
});
