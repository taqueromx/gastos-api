
function init(){
	let url = '/api/gastosVP';
	let settings = {
		method: 'GET'
	}

	fetch(url, settings)
		.then( response => {
			if ( response.ok ){
				return response.json();
			}

			throw new Error ( response.statusText );
		})
		.then( responseJSON => {

			for ( let i = 0; i < responseJSON.length; i ++ ){
				$('.listOfVPs').append(`<li>
				${responseJSON[i].vp} - Periodo JD19: ${responseJSON[i].gastosjd19} unidades
										</li>`)
			}
		})
		.catch( err => {
			console.log( err );
		})
}

init();