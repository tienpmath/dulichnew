import "./hotline.css";
import siteMetadata from "@/config/siteMetadata";
export default function Hotline() {
  return (
    <>
      <div className="hotline-phone-ring-wrap">
        <div className="hotline-phone-ring">
          <div className="hotline-phone-ring-circle"></div>
          <div className="hotline-phone-ring-circle-fill"></div>
          <div className="hotline-phone-ring-img-circle">
            <a href={`tel:${siteMetadata.hotline}`} className="pps-btn-img">
              <img src="/icon-call.png" alt="Gọi điện thoại" width="50" />
            </a>
          </div>
        </div>
        <div className="hotline-bar">
          <a href={`tel:${siteMetadata.hotline}`}>
            <span className="text-hotline">{siteMetadata.hotline_s}</span>
          </a>
        </div>
      </div>
    </>
  );
}
