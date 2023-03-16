import styles from "./HomePage.module.css";
import React, { useState } from "react";
import Multiselect from "multiselect-react-dropdown";

export default function HomePage() {
  const [fileUploaded, setFileUploaded] = useState<any>();
  const [isLoader, setIsLoader] = useState<any>(false);
  const [quantity, setQuantity] = useState<any>();

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
    const qty =  quantity === undefined ? 0 : quantity;
    const data1 = await fetch(
      "/api/getAllPdf?cod=" + selcetedValue.toString() + "&qty=" + qty,
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
    setFileUploaded(event.target.files[0]);
  };

  // const handleClick = (event: any) => {
  //   hiddenFileInput.current.click();
  // };

  const option = [
    { value: "Xpress Bees", label: "Xpress Bees" },
    { value: "Delhivery", label: "Delhivery" },
    { value: "PocketShip-ER", label: "PocketShip-ER" },
    { value: "ElasticRun", label: "ElasticRun" },
    { value: "Ecom Express", label: "Ecom Express" },
    { value: "Shadowfax", label: "Shadowfax" },

  ];

  const [selcetedValue, setSelectedValue] = useState<any[]>([]);

  function selectedValue(selectedList: any, selectedItem: any) {
   
    setSelectedValue([...selcetedValue, selectedItem.value]);
  }

  function removeValue(selectedList: any, selectedItem: any) {
    setSelectedValue(
      selcetedValue.filter((item) => item != selectedItem.value)
    );
  }

  return (
    <>
      <div
        className={styles.navbar}
        style={{
          background: "#fff",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      >
        <h2
          className={styles.h2tag}
          style={{
            fontWeight: "700",
            margin: "0px",
            fontFamily: "IBM Plex Sans,sans-serif",
            padding: "5px",
            textAlign: "end",
            marginRight: "4%",
          }}
        >
          Seller <label style={{ color: "#ffbf20" }}>PDF</label> Cutter
        </h2>
      </div>
      <div
        className="row"
        style={{
          width: "100%",
          padding: "5% 20% 0% 20%;",
          alignItems: "center",
          margin: "0px",
        }}
      >
        <div className="col-7">
          <h2
            className={styles.h2tag}
            style={{
              fontWeight: "700",
              fontSize: "42px",
              lineHeight: "60px",
              marginBottom: "0px",
              textTransform: "uppercase",
              fontFamily: "IBM Plex Sans, sans-serif",
            }}
          >
            Smart{" "}
            <span
              className={styles.spantag}
              style={{
                color: "#ffbf20",
                fontWeight: "700",
                fontSize: "42px",
                lineHeight: "60px",
                marginBottom: "0px",
                textTransform: "uppercase",
                fontFamily: "IBM Plex Sans', sans-serif",
              }}
            >
              Label Crop{" "}
            </span>
            With{" "}
          </h2>
          <h2
            className={styles.h2tag}
            style={{
              fontWeight: "700",
              fontSize: "42px",
              lineHeight: "60px",
              marginBottom: "0px",
              textTransform: "uppercase",
              fontFamily: "IBM Plex Sans', sans-serif",
            }}
          >
            <span
              className={styles.spantag}
              style={{
                color: "#ffbf20",
                fontWeight: "700",
                fontSize: "42px",
                lineHeight: "60px",
                marginBottom: "0px",
                textTransform: "uppercase",
                fontFamily: "IBM Plex Sans', sans-serif",
              }}
            >
              filter for{" "}
            </span>
            messho invoice
          </h2>
          <p
            className={styles.ptag}
            style={{
              fontSize: "20px",
              display: "contents",
              fontWeight: "500",
              paddingTop: "15px",
            }}
          >
            Select your meesho label file and select your Delivery partner and
            serch by quantity and click on prepare shipping labels and then new
            cropped shipping labels will be generated automaticly.
          </p>
          <div className={styles.lab} style={{ paddingTop: "20px" }}>
            <img
              src="/ezgif.com-rotate.gif"
              style={{ width: "25%", border: "1px solid", borderRadius: "9px" }}
              alt=""
            />
          </div>
        </div>
        <div className="col-5">
          <div className={styles.upload_file}>
            <div className={styles.upload_card}>
              <p className={styles.ptag} style={{fontSize:"20px" , textTransform: "uppercase" , fontWeight : "500" , color :"black"}}>Meesho shipping label crop</p>
              <div className={styles.upload_item}>
                <div className={styles.file_upload_button}>
                  <label
                    style={{
                      background: "white",
                      borderRadius: "8px",
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      padding: "16px",
                      width: "87%",
                    }}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      ref={hiddenFileInput}
                      onChange={handleChange}
                      className={styles.hidden}
                      style={{   width: "100%"}}
                    />
                  </label>
                </div>
              </div>
              <div
                className={styles.upload_footer}
                style={{ padding: "5% 0%" }}
              >
                <div className={styles.dropcode}>
                <Multiselect
                  displayValue="value"
                  onSelect={selectedValue}
                  onRemove={removeValue}
                  placeholder="Select delivery partner"
                  options={option}
                  showCheckbox
                  className={styles.drop}
                />
                </div>
              </div>
              <div
                className={styles.upload_footer}
                style={{ padding: "2% 0%" }}
              >
                <div className={styles.inputbox}>
                  <input
                    type="number"
                    className={styles.quantity}
                    placeholder="Filter by quantity"
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </div>
              </div>
              <div
                style={{ textAlign: "center", paddingTop: "20px" }}
              >
                {isLoader && (
                  <>
                    <img src="/spiner.gif" style={{ width: "10%" }} />
                    <p>Pdf On The Way</p>{" "}
                  </>
                )}
                <button
                  disabled={!fileUploaded || selcetedValue.length === 0}
                  onClick={fetchData1}
                  type="submit"
                  style={{
                    padding: "10px 15px",
                    fontSize: "16px",
                    fontWeight: "700",
                    background: "#ffbf20",
                    color: "black",
                    border: "0",
                    borderRadius: "10px",
                  }}
                >
                  Prepare shipping labels
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
