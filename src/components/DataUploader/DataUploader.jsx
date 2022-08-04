export const DataUploader = () => {
 
  const onChange = (e) => {
    e.preventDefault();
    let items = e.target.files;
    let files = [];
    for(let i = 0; i < items.length; i++){
      console.log(items[i]);
      if (items[i]?.name !== ".DS_Store"){
        files = [...files, { name: items[i]?.name, type: "file", file: items[i] }];
      }
    }
    console.log("DATA", files);
  };

  return (
    <>
      <div>
        <h2>Upload file:</h2>
        <input
          type="file"
          multiple
          onChange={(e) => {
            onChange(e);
          }}
        />
      </div>
      <div>
        <h2>Upload folder:</h2>
        <input
          type="file"
          directory=""
          webkitdirectory=""
          onChange={(e) => {
            onChange(e);
          }}
        />
      </div>
    </>
  );
};
