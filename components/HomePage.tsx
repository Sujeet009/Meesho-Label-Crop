import styles from "./HomePage.module.css";
import React, { useState } from "react";
import Multiselect from "multiselect-react-dropdown";

export default function HomePage() {
  const [fileUploaded, setFileUploaded] = useState<any>();
  const [isLoader,setIsLoader] = useState<any>(false);

  function b64toBlob(b64Data: any, fileName: any) {
    const sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {
      type: "application/pdf",
    });

    try {
      const url = window.URL.createObjectURL(blob);
      console.log("url", url);

      const link = document.createElement("a");
      if (link.download !== undefined) {
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error("BlobToSaveAs error", e);
    }
  }

  // api intigration
  const fetchData1 = async () => {
    const data = new FormData();
    setIsLoader(true);
    data.append("file", fileUploaded);
    const data1 = await fetch(
      "/api/getAllPdf?cod=" + selcetedValue.toString(),
      {
        method: "POST",
        body: data,
      }
    ).then(async (data) => {
      let finalRes = await data.json();
      finalRes.body.forEach((element: any) => {
        b64toBlob(element.pdfData, element.fileName);
      });
      setIsLoader(false);
    });
  };

  let hiddenFileInput: any = React.useRef(null);

  const handleChange = (event: any) => {
    // fileUploaded = event.target.files[0];
    setFileUploaded(event.target.files[0]);
  };

  const handleClick = (event: any) => {
    hiddenFileInput.current.click();
  };

  const option = [
    { value: "Xpress Bees", label: "Xpress Bees" },
    { value: "Delhivery", label: "Delhivery" },
    { value: "PocketShip-ER", label: "PocketShip-ER" },
    { value: "ElasticRun", label: "ElasticRun" },
  ];

  const [selcetedValue, setSelectedValue] = useState<any[]>([]);

  function selectedValue(selectedList: any, selectedItem: any) {
    console.log(selectedItem.value);
    setSelectedValue([...selcetedValue, selectedItem.value]);
  }

  function removeValue(selectedList: any, selectedItem: any) {
    setSelectedValue(
      selcetedValue.filter((item) => item != selectedItem.value)
    );
  }

  function submitReport() {
    fetchData1();
  }

  console.log("selcetedValue", selcetedValue);

  return (
    <>  
      <div className={styles.textbackitem}>
      <div className={styles.iconnavbar} >
                    <img src="/logo.png" className={styles.logoicon} alt="" />
                    <img src="/logo_name.png" className={styles.logoname} alt="" />
                </div>
        <h3 className={styles.text}>Meesho Shipping Label Crop</h3>
      </div>

      <div className={styles.card}>
        <div className={styles.cardbody}>
          <div className={styles.p}>
            <p>
              Select your meesho label file below and click on prepare shipping
              labels and then new cropped shipping labels will be generated
              automaticly.
            </p>
            <p>
              All lables will be grouped and shorted by sku for easy order
              prepare.
            </p>
            <div className={styles.icon}>
              <div className={styles.file}>
                <img className={styles.logo} src="/Meesho_Logo_Full.png" />
                <button className={styles.upload} onClick={handleClick}>Choose File</button>
                <input
                  type="file"
                  ref={hiddenFileInput}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </div>
              <div className={styles.selectdrop}>
                <span>Select Destination Code </span>
                <Multiselect
                  displayValue="value"
                  onSelect={selectedValue}
                  onRemove={removeValue}
                  placeholder="Select Code"
                  options={option}
                  showCheckbox
                />
                </div>
            </div>
            <img src="/lbl.jpg" alt="" />
            <div>
              <div className={styles.center}>
                {isLoader &&<><img src="/png1.gif" style={{width: "10%"}} /><p>Pdf On The Way</p> </>} 
                <button disabled={!fileUploaded || selcetedValue.length === 0 } className={styles.button} onClick={submitReport} type="submit">
                  Prepare Shipping Labels
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </>
  );
}
