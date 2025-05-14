"use client"

import { useState, useEffect } from "react"

interface TestImage {
  id: number
  path: string
  trueLabel: string
}

const ImageRecognitionAdminPage = () => {
  const [testImages, setTestImages] = useState<TestImage[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    initializeTestImages()
  }, [])

  const initializeTestImages = () => {
    setLoading(true)

    // Create 10 test images with true labels
    const images: TestImage[] = [
      { id: 1, path: "/test-images/cat1.png", trueLabel: "cat" },
      { id: 2, path: "/test-images/dog1.png", trueLabel: "dog" },
      { id: 3, path: "/test-images/bird1.png", trueLabel: "bird" },
      { id: 4, path: "/tabby-cat-sunbeam.png", trueLabel: "cat" },
      { id: 5, path: "/test-images/car1.png", trueLabel: "car" },
      { id: 6, path: "/test-images/house1.png", trueLabel: "house" },
      { id: 7, path: "/solitary-oak.png", trueLabel: "tree" },
      { id: 8, path: "/diverse-group.png", trueLabel: "person" },
      { id: 9, path: "/single-vibrant-flower.png", trueLabel: "flower" },
      { id: 10, path: "/majestic-mountain-range.png", trueLabel: "mountain" },
    ]

    setTestImages(images)
    setLoading(false)
  }

  return (
    <div>
      <h1>Image Recognition Admin</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Test Images</h2>
          <ul>
            {testImages.map((image) => (
              <li key={image.id}>
                <img
                  src={image.path || "/placeholder.svg"}
                  alt={image.trueLabel}
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
                <p>True Label: {image.trueLabel}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ImageRecognitionAdminPage
