"use client";
import { useEffect, useState, type ChangeEvent } from "react";

export default function AccountPage() {
  const [firstName, setFirstName] = useState("sung");
  const [lastName, setLastName] = useState("zaki");
  const [email, setEmail] = useState("sunnyu391@gmail.com");
  const [phone, setPhone] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [textNotif, setTextNotif] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => { if (avatarUrl) URL.revokeObjectURL(avatarUrl); };
  }, [avatarUrl]);

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="account-outer">
      <div className="account-card">
        <section className="panel">
          <h2 className="section-title">My Account</h2>
          <p className="section-caption">User Profile</p>

          <div className="form-grid single-column">
            <div className="input-group full-row">
              <label className="input-label" htmlFor="avatar">Profile image</label>
              <input id="avatar" className="file-input-hidden" type="file" accept="image/*" onChange={onAvatarChange} />
              <label htmlFor="avatar" className="uploader-box" aria-label="Upload Profile Image">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile preview" className="uploader-image" />
                ) : (
                  <span className="uploader-text">Upload Profile Image</span>
                )}
              </label>
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
        </section>

        <section className="panel">
          <h3 className="danger-title">Danger Zone</h3>
          <p className="input-label">Delete Account</p>
          <button className="danger-button" type="button">Delete Account</button>
        </section>
      </div>
    </div>
  );
}
