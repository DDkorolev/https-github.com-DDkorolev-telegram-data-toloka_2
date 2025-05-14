# Image Recognition Testing Feature

This feature allows administrators to test the performance of the image recognition system on a set of test images and view detailed statistics about the results.

## How to Use

1. Navigate to the admin panel and log in with your admin credentials
2. Click on "Распознавание" in the sidebar or "Тестирование распознавания" in the dashboard quick actions
3. On the Image Recognition Testing page, click the "Запустить тестирование" button
4. The system will process 10 test images and display the results

## Understanding the Results

After processing is complete, you'll see a comprehensive statistical summary:

### Performance Metrics

- **Точность (Accuracy)**: The overall percentage of correct predictions
- **Precision**: The percentage of correct positive predictions among all positive predictions
- **Recall**: The percentage of correct positive predictions among all actual positive cases
- **F1 Score**: The harmonic mean of precision and recall, useful for imbalanced datasets

### Visualizations

- **Bar Chart**: Shows all four metrics side by side for easy comparison
- **Pie Chart**: Displays the confusion matrix (True Positives, False Positives, True Negatives, False Negatives)

### Detailed Results Table

The table shows each test image along with:
- The true label (what the image actually contains)
- The predicted label (what the system thought it contained)
- The confidence score (how sure the system was about its prediction)
- Whether the prediction was correct or incorrect

## Technical Details

In a production environment, this feature would connect to your actual image recognition model. The current implementation simulates recognition with:

- 80% accuracy rate
- Randomized confidence scores (higher for correct predictions)
- Realistic test images covering various categories

This testing tool helps you evaluate and improve your image recognition system over time.
