const socket = io();

socket.on('newRequest', ({ trapId, date, ip, method, protocol, query, queryParams, cookies, headers }) => {
	const newTR = document.createElement('tr');
	const newRequestHTML = `					
		<td>${trapId}</td>
		<td>${date}</td>
		<td>${ip}</td>
		<td>${method}</td>
		<td>${protocol}</td>
		<td>${query}</td>
		<td><pre class="text-white">${queryParams}</pre></td>
		<td><pre class="text-white">${cookies}</pre></td>
		<td><pre class="text-white">${headers}</pre></td>		
	`;
	newTR.innerHTML = newRequestHTML;

	tableOfRequests.insertBefore(newTR, tableOfRequests.children[0]);

	const sixthElement = document.querySelectorAll('#tableOfRequests tr')[6];			
	sixthElement.remove();
})

