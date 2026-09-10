function StatCard({ icon: Icon, label, value, detail }) { return <article className="stat-card"><span className="stat-icon"><Icon size={23} /></span><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></article>; }
export default StatCard;
