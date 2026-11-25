const defaultPdfUrl = 'https://www.ulyssessailing.gr/wp-content/uploads/2022/02/TOURISMOS_WEBEN_EPAnEK.pdf';

export default function EspaBanner({ pdfUrl = defaultPdfUrl }: { pdfUrl?: string }) {
    const image = <img src="/assets/images/shared/espa-funding-banner.jpg"
        alt="Co-funded by the European Union European Regional Development Fund and ESPA 2014–2020"
        width="440" height="60" decoding="async" />;

    return <div className="espa-banner" aria-label="European funding information">
        {pdfUrl ? <a href={pdfUrl} target="_blank" rel="nofollow noopener noreferrer">{image}</a> : image}
    </div>;
}
