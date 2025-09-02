"use client";
import { useState } from "react";

export default function AccountPage() {
  const [firstName, setFirstName] = useState("sung");
  const [lastName, setLastName] = useState("zaki");
  const [email, setEmail] = useState("sunnyu391@gmail.com");
  const [phone, setPhone] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [textNotif, setTextNotif] = useState(true);

  return (
    <div className="account-container">
      <h2 className="section-title">My Account</h2>

      <div className="form-grid">
        <div className="input-group full-row">
          <label className="input-label">Profile image</label>
          <input className="file-input" type="file" accept="image/*" />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="first">First name</label>
          <input id="first" className="text-input" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="last">Last name</label>
          <input id="last" className="text-input" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="email">Email</label>
          <input id="email" className="text-input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="phone">Phone</label>
          <input id="phone" className="text-input" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="" />
        </div>

        <div className="input-group full-row">
          <label className="input-label">Email notification?</label>
          <div className="switch-row">
            <button type="button" aria-pressed={emailNotif} className={"switch" + (emailNotif ? " is-on" : "")} onClick={() => setEmailNotif(v=>!v)} />
            <span>{emailNotif ? "On" : "Off"}</span>
          </div>
        </div>

        <div className="input-group full-row">
          <label className="input-label">Text notifications?</label>
          <div className="switch-row">
            <button type="button" aria-pressed={textNotif} className={"switch" + (textNotif ? " is-on" : "")} onClick={() => setTextNotif(v=>!v)} />
            <span>{textNotif ? "On" : "Off"}</span>
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <h3 className="danger-title">Danger Zone</h3>
        <button className="danger-button" type="button">Delete Account</button>
      </div>
    </div>
  );
}
