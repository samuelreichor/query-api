type Props = {
  type?: string
  sectionHandle?: string
}

const CraftNotImplemented = (props: Props) => {
  const { type, sectionHandle, ...restAttrs } = props
  const kind = type ? 'Component' : 'Page'
  const name = type || sectionHandle

  return (
    <div>
      <h2>
        Not Implemented {kind}: {name}
      </h2>
      <pre>{JSON.stringify(restAttrs, null, 2)}</pre>
    </div>
  )
}

export default CraftNotImplemented
