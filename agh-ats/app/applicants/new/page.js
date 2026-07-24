"use client";

import { useRef, useState } from "react";
import { createWorker } from "tesseract.js";
import { UploadCloud, LoaderCircle, CheckCircle2, AlertTriangle } from "lucide-react";

function cleanMrz(text) {
  return text
    .toUpperCase()
    .replace(/[^\nA-Z0-9<]/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseMrzDate(value, expiry = false) {
  if (!/^\d{6}$/.test(value)) return "";
  const yy = Number(value.slice(0, 2));
  const mm = value.slice(2, 4);
  const dd = value.slice(4, 6);
  const currentYY = new Date().getFullYear() % 100;
  let century;

  if (expiry) {
    century = yy < 70 ? 2000 : 1900;
  } else {
    century = yy > currentYY ? 1900 : 2000;
  }

  return `${century + yy}-${mm}-${dd}`;
}

function nationalityFromCode(code) {
  const map = {
    IDN: "Indonesia",
    PHL: "Philippines",
    MMR: "Myanmar",
    IND: "India",
    LKA: "Sri Lanka",
    BGD: "Bangladesh",
    KHM: "Cambodia",
    THA: "Thailand",
    MYS: "Malaysia",
  };
  return map[code] || code;
}

function parsePassportMrz(rawText) {
  const lines = cleanMrz(rawText);
  let line1 = lines.find((line) => line.startsWith("P<") && line.length >= 40);
  let line2 = "";

  if (line1) {
    const index = lines.indexOf(line1);
    line2 = lines.slice(index + 1).find((line) => line.length >= 40) || "";
  }

  if (!line1 || !line2) {
    const candidates = lines.filter((line) => line.length >= 40);
    line1 = candidates[0] || "";
    line2 = candidates[1] || "";
  }

  if (!line1 || !line2) {
    throw new Error("The passport MRZ lines could not be read. Use a clear, straight photo.");
  }

  line1 = line1.padEnd(44, "<").slice(0, 44);
  line2 = line2.padEnd(44, "<").slice(0, 44);

  const nameArea = line1.slice(5);
  const [surnameRaw = "", givenRaw = ""] = nameArea.split("<<");
  const surname = surnameRaw.replace(/</g, " ").trim();
  const givenParts = givenRaw.replace(/</g, " ").trim().split(/\s+/).filter(Boolean);

  return {
    lastName: surname,
    firstName: givenParts[0] || "",
    middleName: givenParts.slice(1).join(" "),
    passportNumber: line2.slice(0, 9).replace(/</g, "").trim(),
    nationality: nationalityFromCode(line2.slice(10, 13)),
    dateOfBirth: parseMrzDate(line2.slice(13, 19), false),
    sex: line2.slice(20, 21) === "F" ? "Female" : line2.slice(20, 21) === "M" ? "Male" : "",
    passportExpiry: parseMrzDate(line2.slice(21, 27), true),
  };
}

const initialForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  nationality: "",
  dateOfBirth: "",
  sex: "",
  passportNumber: "",
  passportExpiry: "",
};

export default function NewApplicantPage() {
  const [form, setForm] = useState(initialForm);
  const [passportFile, setPassportFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [ocrStatus, setOcrStatus] = useState("idle");
  const [ocrMessage, setOcrMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function selectPassport(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setOcrStatus("error");
      setOcrMessage("Please upload a JPG, PNG, WEBP or another passport image.");
      return;
    }
    setPassportFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setOcrStatus("ready");
    setOcrMessage("Passport image ready. Click Read Passport & Auto-Fill.");
  }

  function handleDrop(event) {
    event.preventDefault();
    selectPassport(event.dataTransfer.files?.[0]);
  }

  async function runOcr() {
    if (!passportFile) return;

    setOcrStatus("reading");
    setOcrMessage("Reading passport. This can take 10 to 30 seconds...");
    let worker;

    try {
      worker = await createWorker("eng");
      const result = await worker.recognize(passportFile);
      const parsed = parsePassportMrz(result.data.text);

      setForm((current) => ({
        ...current,
        ...parsed,
      }));

      setOcrStatus("success");
      setOcrMessage("Passport information detected. Please check every field before saving.");
    } catch (error) {
      setOcrStatus("error");
      setOcrMessage(error.message || "Passport reading failed. Please enter the details manually.");
    } finally {
      if (worker) await worker.terminate();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSaved(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Applicant Management</p>
          <h1>Add Applicant</h1>
          <p>Upload a passport to auto-fill identity details, then complete the biodata.</p>
        </div>
      </div>

      {saved && (
        <div className="success-message">
          Prototype saved on screen only. Permanent database saving will be added next.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <section className="panel form-section">
          <h2>1. Passport OCR</h2>
          <p className="section-help">
            Drag and drop a clear passport photo. The system reads the machine-readable lines at the bottom of the passport.
          </p>

          <div
            className={`drop-zone ${passportFile ? "has-file" : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => selectPassport(event.target.files?.[0])}
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Passport preview" className="passport-preview" />
            ) : (
              <UploadCloud size={36} />
            )}
            <strong>{passportFile ? passportFile.name : "Drop passport image here"}</strong>
            <span>or click to choose a JPG, PNG or WEBP file</span>
          </div>

          <div className="ocr-actions">
            <button
              type="button"
              className="primary-button"
              onClick={runOcr}
              disabled={!passportFile || ocrStatus === "reading"}
            >
              {ocrStatus === "reading" ? (
                <>
                  <LoaderCircle className="spin" size={17} /> Reading Passport...
                </>
              ) : (
                "Read Passport & Auto-Fill"
              )}
            </button>
          </div>

          {ocrMessage && (
            <div className={`ocr-message ${ocrStatus}`}>
              {ocrStatus === "success" && <CheckCircle2 size={18} />}
              {ocrStatus === "error" && <AlertTriangle size={18} />}
              {ocrMessage}
            </div>
          )}
        </section>

        <section className="panel form-section">
          <h2>2. Personal Information</h2>
          <div className="form-grid">
            <label>
              First Name
              <input value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} required />
            </label>
            <label>
              Middle Name
              <input value={form.middleName} onChange={(e) => updateField("middleName", e.target.value)} />
            </label>
            <label>
              Last Name
              <input value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} required />
            </label>
            <label>
              Nationality
              <input value={form.nationality} onChange={(e) => updateField("nationality", e.target.value)} required />
            </label>
            <label>
              Date of Birth
              <input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} required />
            </label>
            <label>
              Sex
              <select value={form.sex} onChange={(e) => updateField("sex", e.target.value)}>
                <option value="">Select</option>
                <option>Female</option>
                <option>Male</option>
              </select>
            </label>
            <label>
              Race / Ethnicity
              <input placeholder="e.g. Javanese, Filipino" />
            </label>
            <label>
              Contact Number
              <input placeholder="+62 / +63..." />
            </label>
            <label>
              Height (cm)
              <input type="number" min="100" max="220" placeholder="e.g. 158" />
            </label>
            <label>
              Weight (kg)
              <input type="number" min="30" max="180" step="0.1" placeholder="e.g. 52" />
            </label>
            <label>
              Passport Number
              <input value={form.passportNumber} onChange={(e) => updateField("passportNumber", e.target.value)} />
            </label>
            <label>
              Passport Expiry
              <input type="date" value={form.passportExpiry} onChange={(e) => updateField("passportExpiry", e.target.value)} />
            </label>
            <label>
              Passport Status
              <select defaultValue="Available">
                <option>Available</option>
                <option>Application in progress</option>
                <option>Not applied</option>
                <option>Expired</option>
                <option>Lost or damaged</option>
              </select>
            </label>
            <label>
              Current Location
              <input placeholder="City / Province / Country" />
            </label>
          </div>
        </section>

        <section className="panel form-section">
          <h2>3. Family Background</h2>
          <div className="form-grid">
            <label>
              Marital Status
              <select defaultValue="">
                <option value="">Select</option>
                <option>Single</option>
                <option>Married</option>
                <option>Separated</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>
            </label>
            <label>
              Husband / Spouse Name
              <input placeholder="Leave blank if not applicable" />
            </label>
            <label>
              Husband / Spouse Occupation
              <input placeholder="Job or occupation" />
            </label>
            <label>
              Number of Children
              <input type="number" min="0" placeholder="0" />
            </label>
            <label className="full-width">
              Children Information
              <textarea
                rows="4"
                placeholder="Example: Child 1 – Female, 8 years old; Child 2 – Male, 4 years old"
              />
            </label>
            <label>
              Number of Brothers
              <input type="number" min="0" placeholder="0" />
            </label>
            <label>
              Number of Sisters
              <input type="number" min="0" placeholder="0" />
            </label>
            <label>
              Applicant's Birth Order
              <input placeholder="e.g. 2nd of 5 siblings" />
            </label>
            <label>
              Father's Occupation
              <input placeholder="Occupation or deceased" />
            </label>
            <label>
              Mother's Occupation
              <input placeholder="Occupation or deceased" />
            </label>
            <label className="full-width">
              Family Background Notes
              <textarea
                rows="4"
                placeholder="Living arrangement, who cares for the children, financial responsibilities, family support, etc."
              />
            </label>
          </div>
        </section>

        <section className="panel form-section">
          <h2>4. Recruitment Source</h2>
          <div className="form-grid">
            <label>
              Source Type
              <select defaultValue="Supplier">
                <option>Supplier</option>
                <option>Consultant</option>
                <option>Facebook</option>
                <option>TikTok</option>
                <option>Referral</option>
                <option>Walk-in</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Supplier / Source Name
              <input placeholder="ABC Supplier" />
            </label>
            <label>
              Assigned Consultant
              <input placeholder="Consultant name" />
            </label>
            <label>
              Source Reference
              <input placeholder="Optional reference number" />
            </label>
          </div>
        </section>

        <section className="panel form-section">
          <h2>5. Work Profile</h2>
          <div className="form-grid">
            <label>
              Expected Salary
              <input type="number" placeholder="SGD" />
            </label>
            <label>
              Years of Experience
              <input type="number" min="0" placeholder="0" />
            </label>
            <label className="full-width">
              Skills
              <textarea rows="4" placeholder="Childcare, infant care, elderly care, cooking, housekeeping..." />
            </label>
            <label className="full-width">
              Employment History
              <textarea rows="6" placeholder="Employer country, dates, duties and reason for leaving" />
            </label>
          </div>
        </section>

        <section className="panel form-section">
          <h2>6. Interview Centre</h2>
          <div className="form-grid">
            <label className="full-width">
              Interview Video
              <input type="file" accept="video/*" />
            </label>
            <label className="full-width">
              Interview Transcript
              <input type="file" accept=".txt,.pdf,.doc,.docx,.srt" />
            </label>
            <label>
              English Score
              <input type="number" min="1" max="5" />
            </label>
            <label>
              Attitude Score
              <input type="number" min="1" max="5" />
            </label>
            <label>
              Childcare Score
              <input type="number" min="1" max="5" />
            </label>
            <label>
              Cooking Score
              <input type="number" min="1" max="5" />
            </label>
            <label className="full-width">
              Interview Summary
              <textarea rows="5" placeholder="AI summary will be added later." />
            </label>
            <label className="full-width">
              Consultant Notes
              <textarea rows="5" />
            </label>
          </div>
        </section>

        <div className="form-actions">
          <button type="button" className="secondary-button">Save Draft</button>
          <button type="submit" className="primary-button">Save Applicant</button>
        </div>
      </form>
    </div>
  );
}