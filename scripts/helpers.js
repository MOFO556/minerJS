
export function countMines (width, height, mines)	{
	return	((width * height > mines) ? mines : width * height - 1);
}

export function hideInfo()  {
  let infoWindow = document.getElementById("infoBlock");
  if (infoWindow.style.display === "block") {infoWindow.style.display = "none";}
}