export default function DynamicHeader({ title, tag: Tag='h1', className }) {
  return <Tag className={`title ${className}`}>{title}</Tag>;
}
