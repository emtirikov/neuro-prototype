// download.js
const downloadButton = document.getElementById('download-button');
const downloadOptions = document.getElementById('download-options');

downloadButton.addEventListener('click', () => {
  const selectedOptions = Array.from(downloadOptions.selectedOptions).map(option => option.value);
  console.log('Selected options:', selectedOptions);

  window.electron.runBashScript('test.sh').then(({ stdout, stderr }) => {
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});